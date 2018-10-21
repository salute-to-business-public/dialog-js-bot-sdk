/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Bluebird from 'bluebird';
import { ChannelCredentials, Metadata } from 'grpc';
import { dialog } from '@dlghq/dialog-api';

class Messaging {
  private readonly service: any;

  constructor(endpoint: string, credentials: ChannelCredentials) {
    // @ts-ignore
    this.service = Bluebird.promisifyAll(new dialog.Messaging(endpoint, credentials));
  }

  fetchDialogIndex(
    request: dialog.RequestFetchDialogIndex,
    metadata: Metadata
  ): Promise<dialog.ResponseFetchDialogIndex> {
    return this.service.fetchDialogIndexAsync(request, metadata);
  }

  loadDialogs(
    request: dialog.RequestLoadDialogs,
    metadata: Metadata
  ): Promise<dialog.ResponseLoadDialogs> {
    return this.service.loadDialogsAsync(request, metadata);
  }

  sendMessage(
    request: dialog.RequestSendMessage,
    metadata: Metadata
  ): Promise<dialog.ResponseSeqDate> {
    return this.service.sendMessageAsync(request, metadata);
  }
}

export default Messaging;
