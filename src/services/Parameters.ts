/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Bluebird from 'bluebird';
import { ChannelCredentials, Metadata } from 'grpc';
import { dialog } from '@dlghq/dialog-api';

class Parameters {
  private readonly service: any;

  constructor(endpoint: string, credentials: ChannelCredentials) {
    // @ts-ignore
    this.service = Bluebird.promisifyAll(new dialog.ConfigSync(endpoint, credentials));
  }

  getParameters(
    request: dialog.RequestGetParameters,
    metadata: Metadata
  ): Promise<dialog.ResponseGetParameters> {
    return this.service.getParametersAsync(request, metadata);
  }

  editParameter(
    request: dialog.RequestEditParameter,
    metadata: Metadata
  ): Promise<dialog.ResponseSeq> {
    return this.service.editParameterAsync(request, metadata);
  }
}

export default Parameters;
