/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { ChannelCredentials } from 'grpc';
import Messaging from './Messaging';
import Registration from './Registration';
import Authentication from './Authentication';
import SequenceAndUpdates from './SequenceAndUpdates';

class Services {
  public readonly messaging: Messaging;
  public readonly registration: Registration;
  public readonly authentication: Authentication;
  public readonly sequenceAndUpdates: SequenceAndUpdates;

  constructor({ host }: URL, credentials: ChannelCredentials) {
    this.messaging = new Messaging(host, credentials);
    this.registration = new Registration(host, credentials);
    this.authentication = new Authentication(host, credentials);
    this.sequenceAndUpdates = new SequenceAndUpdates(host, credentials);
  }
}

export default Services;
