/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { ChannelCredentials } from 'grpc';
import Contacts from './Contacts';
import Messaging from './Messaging';
import Parameters from './Parameters';
import Registration from './Registration';
import MediaAndFiles from './MediaAndFiles';
import Authentication from './Authentication';
import SequenceAndUpdates from './SequenceAndUpdates';

class Services {
  public readonly contacts: Contacts;
  public readonly messaging: Messaging;
  public readonly parameters: Parameters;
  public readonly registration: Registration;
  public readonly mediaAndFiles: MediaAndFiles;
  public readonly authentication: Authentication;
  public readonly sequenceAndUpdates: SequenceAndUpdates;

  constructor({ host }: URL, credentials: ChannelCredentials) {
    this.contacts = new Contacts(host, credentials);
    this.messaging = new Messaging(host, credentials);
    this.parameters = new Parameters(host, credentials);
    this.registration = new Registration(host, credentials);
    this.mediaAndFiles = new MediaAndFiles(host, credentials);
    this.authentication = new Authentication(host, credentials);
    this.sequenceAndUpdates = new SequenceAndUpdates(host, credentials);
  }
}

export default Services;
