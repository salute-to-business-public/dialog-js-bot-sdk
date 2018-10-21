/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { ReadStream } from 'fs';
import { Observable, Subscriber } from 'rxjs';

function fromReadStream(stream: ReadStream): Observable<Buffer> {
  return Observable.create((emitter: Subscriber<Buffer>) => {
    const onData = (data: Buffer) => emitter.next(data);
    const onError = (error: Error) => emitter.error(error);
    const onComplete = () => emitter.complete();

    stream.addListener('data', onData);
    stream.addListener('error', onError);
    stream.addListener('end', onComplete);

    return () => {
      stream.removeListener('data', onData);
      stream.removeListener('error', onError);
      stream.removeListener('end', onComplete);

      stream.destroy();
    };
  });
}

export default fromReadStream;
