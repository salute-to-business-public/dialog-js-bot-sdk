/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { Peer } from '../entities';

class PeerNotFoundError extends Error {
  readonly name = 'PeerNotFoundError';
  readonly peer: Peer;

  constructor(peer: Peer) {
    super(`${peer} unexpectedly not found`);

    this.peer = peer;
  }
}

export default PeerNotFoundError;
