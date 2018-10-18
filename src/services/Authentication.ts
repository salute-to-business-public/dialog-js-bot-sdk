/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Bluebird from 'bluebird';
import { ChannelCredentials, Metadata } from 'grpc';
import { dialog } from '@dlghq/dialog-api';

class Authentication {
  private readonly service: any;

  constructor(endpoint: string, credentials: ChannelCredentials) {
    // @ts-ignore
    this.service = Bluebird.promisifyAll(new dialog.Authentication(endpoint, credentials));
  }

  startTokenAuth(
    request: dialog.RequestStartTokenAuth,
    metadata: Metadata
  ): Promise<dialog.ResponseAuth> {
    return this.service.startTokenAuthAsync(request, metadata);
  }
}

export default Authentication;
