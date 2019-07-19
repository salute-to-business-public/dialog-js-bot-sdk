/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { Metadata } from 'grpc';
import { dialog } from '@dlghq/dialog-api';
import Service, { Config } from './Service';

class Authentication extends Service<any> {
  constructor(config: Config) {
    super(dialog.Authentication, config);
  }

  startTokenAuth(
    request: dialog.RequestStartTokenAuth,
    metadata?: Metadata
  ): Promise<dialog.ResponseAuth> {
    return this.service.startTokenAuthAsync(
      request,
      metadata,
      this.getCallOptions()
    );
  }
}

export default Authentication;
