/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Bluebird from 'bluebird';
import { ChannelCredentials, Metadata, ClientReadableStream } from 'grpc';
import { dialog, google } from '@dlghq/dialog-api';
import { Observable, Subscriber } from 'rxjs';

class SequenceAndUpdates {
  private readonly service: any;

  constructor(endpoint: string, credentials: ChannelCredentials) {
    // @ts-ignore
    this.service = Bluebird.promisifyAll(new dialog.SequenceAndUpdates(endpoint, credentials));
  }

  public getState(
    request: dialog.RequestGetState,
    metadata: Metadata
  ): Promise<dialog.ResponseSeq> {
    return this.service.getStateAsync(request, metadata);
  }

  public getDifference(
    request: dialog.RequestGetDifference,
    metadata: Metadata
  ): Promise<dialog.ResponseGetDifference> {
    return this.service.getDifferenceAsync(request, metadata);
  }

  public getReferencedEntities(
    request: dialog.RequestGetReferencedEntitites,
    metadata: Metadata
  ): Promise<dialog.ResponseGetReferencedEntitites> {
    return this.service.getReferencedEntititesAsync(request, metadata);
  }

  public seqUpdates(
    request: google.protobuf.Empty,
    metadata: Metadata
  ): Observable<dialog.SeqUpdateBox> {
    return Observable.create((emitter: Subscriber<dialog.SeqUpdateBox>) => {
      const call: ClientReadableStream<dialog.SeqUpdateBox> = this.service.seqUpdates(
        request,
        metadata
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
