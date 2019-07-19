/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Long from 'long';
import { dialog, google } from '@dlghq/dialog-api';
import Peer from './Peer';
import { peerTypeToApi } from './PeerType';

class OutPeer {
  public readonly peer: Peer;
  public readonly accessHash: Long;

  public static from(api: dialog.OutPeer) {
    return new OutPeer(Peer.from(api), api.accessHash);
  }

  public static create(peer: Peer, accessHash: Long) {
    return new OutPeer(peer, accessHash);
  }

  private constructor(peer: Peer, accessHash: Long) {
    this.peer = peer;
    this.accessHash = accessHash;
  }

  public toApi(): dialog.OutPeer {
    return dialog.OutPeer.create({
      id: this.peer.id,
      type: peerTypeToApi(this.peer.type),
      strId: this.peer.strId
        ? google.protobuf.StringValue.create({ value: this.peer.strId })
        : null,
      accessHash: this.accessHash,
    });
  }

  public toString() {
    return `OutPeer(${this.peer})`;
  }
}

export default OutPeer;
