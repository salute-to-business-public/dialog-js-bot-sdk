/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Bluebird from 'bluebird';
import { ChannelCredentials, Metadata } from 'grpc';
import { dialog } from '@dlghq/dialog-api';

class Contacts {
  private readonly service: any;

  constructor(endpoint: string, credentials: ChannelCredentials) {
    // @ts-ignore
    this.service = Bluebird.promisifyAll(new dialog.Contacts(endpoint, credentials));
  }

  searchContacts(
    request: dialog.RequestSearchContacts,
    metadata: Metadata
  ): Promise<dialog.ResponseSearchContacts> {
    return this.service.searchContactsAsync(request, metadata);
  }
}

export default Contacts;
