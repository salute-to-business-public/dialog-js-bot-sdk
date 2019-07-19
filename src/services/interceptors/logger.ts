/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { Logger } from 'pino';
import {
  InterceptingCall,
  RequesterBuilder,
  ListenerBuilder,
  CallOptions,
} from 'grpc';

let id = 0;
function createLogInterceptor(logger: Logger) {
  return (
    options: CallOptions,
    nextCall: (options: CallOptions) => InterceptingCall,
  ) => {
    const logPrefix = `[${id++}] ${options.method_definition.path}`;

    const requester = new RequesterBuilder()
      .withStart((metadata, listener, next) => {
        logger.debug(
          `${logPrefix} -> metadata = ${JSON.stringify(metadata.getMap())}`,
        );
        const nextListener = new ListenerBuilder()
          .withOnReceiveStatus((status, next) => {
            logger.debug(
              `${logPrefix} <- code = ${status.code} details = ${status.details}`,
            );
            next(status);
          })
          .withOnReceiveMessage((message, next) => {
            logger.debug(`${logPrefix} <- ${JSON.stringify(message)}`);
            next(message);
          })
          .withOnReceiveMetadata((metadata, next) => {
            logger.debug(
              `${logPrefix} <- metadata = ${JSON.stringify(metadata.getMap())}`,
            );
            next(metadata);
          })
          .build();

        next(metadata, nextListener);
      })
      .withSendMessage((message, next) => {
        logger.debug(`${logPrefix}(${JSON.stringify(message)})`);
        next(message);
      })
      .withHalfClose((next) => {
        logger.debug(`${logPrefix} <- half-close`);
        next();
      })
      .withCancel((next) => {
        logger.debug(`${logPrefix} <- cancelled`);
        next();
      })
      .build();

    return new InterceptingCall(nextCall(options), requester);
  };
}

export default createLogInterceptor;
