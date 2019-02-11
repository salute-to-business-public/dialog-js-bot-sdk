/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { ChannelCredentials } from 'grpc';
import Messaging from './Messaging';
import Registration from './Registration';
import Authentication from './Authentication';
import SequenceAndUpdates from './SequenceAndUpdates';
import MediaAndFiles from './MediaAndFiles';
import Contacts from './Contacts';

class Services {
  public readonly contacts: Contacts;
  public readonly messaging: Messaging;
  public readonly registration: Registration;
  public readonly mediaAndFiles: MediaAndFiles;
  public readonly authentication: Authentication;
  public readonly sequenceAndUpdates: SequenceAndUpdates;

  constructor({ host }: URL, credentials: ChannelCredentials) {
    this.contacts = new Contacts(host, credentials);
    this.messaging = new Messaging(host, credentials);
    this.registration = new Registration(host, credentials);
    this.mediaAndFiles = new MediaAndFiles(host, credentials);
    this.authentication = new Authentication(host, credentials);
    this.sequenceAndUpdates = new SequenceAndUpdates(host, credentials);
  }
}

export default Services;
