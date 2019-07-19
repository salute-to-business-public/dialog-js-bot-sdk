/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { Metadata, ClientReadableStream } from 'grpc';
import { dialog, google } from '@dlghq/dialog-api';
import { Observable, Subscriber } from 'rxjs';
import Service, { Config } from './Service';

class SequenceAndUpdates extends Service<any> {
  constructor(config: Config) {
    super(dialog.SequenceAndUpdates, config);
  }

  public getState(
    request: dialog.RequestGetState,
    metadata?: Metadata,
  ): Promise<dialog.ResponseSeq> {
    return this.service.getStateAsync(request, metadata, this.getCallOptions());
  }

  public getDifference(
    request: dialog.RequestGetDifference,
    metadata?: Metadata,
  ): Promise<dialog.ResponseGetDifference> {
    return this.service.getDifferenceAsync(
      request,
      metadata,
      this.getCallOptions(),
    );
  }

  public getReferencedEntities(
    request: dialog.RequestGetReferencedEntitites,
    metadata?: Metadata,
  ): Promise<dialog.ResponseGetReferencedEntitites> {
    return this.service.getReferencedEntititesAsync(
      request,
      metadata,
      this.getCallOptions(),
    );
  }

  public seqUpdates(
    request: google.protobuf.Empty,
    metadata?: Metadata,
  ): Observable<dialog.SeqUpdateBox> {
    return Observable.create((emitter: Subscriber<dialog.SeqUpdateBox>) => {
      const call: ClientReadableStream<
        dialog.SeqUpdateBox
      > = this.service.seqUpdates(
        request,
        metadata,
        this.getCallOptions({ deadline: Infinity }),
      );

      call.on('data', (update: dialog.SeqUpdateBox) => emitter.next(update));
      call.on('end', () => emitter.complete());
      call.on('error', (error) => emitter.error(error));

      return () => {
        call.cancel();
      };
    });
  }
}

export default SequenceAndUpdates;
