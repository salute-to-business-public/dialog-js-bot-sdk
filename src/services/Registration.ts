/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Bluebird from 'bluebird';
import { ChannelCredentials, Metadata } from 'grpc';
import { dialog } from '@dlghq/dialog-api';

class Registration {
  private readonly service: any;

  constructor(endpoint: string, credentials: ChannelCredentials) {
    // @ts-ignore
    this.service = Bluebird.promisifyAll(new dialog.Registration(endpoint, credentials));
  }

  registerDevice(request: dialog.RequestRegisterDevice): Promise<dialog.ResponseDeviceRequest> {
    return this.service.registerDeviceAsync(request);
  }
}

export default Registration;
