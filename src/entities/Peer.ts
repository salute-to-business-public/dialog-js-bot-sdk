/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog, google } from '@dlghq/dialog-api';
import PeerType from './PeerType';
import { getOpt } from './utils';

class Peer {
  public readonly id: number;
  public readonly type: PeerType;
  public readonly strId: null | string;

  public static sip(strId: string) {
    return new Peer(0, PeerType.SIP, strId);
  }

  public static private(id: number) {
    return new Peer(id, PeerType.PRIVATE, null);
  }

  public static group(id: number) {
    return new Peer(id, PeerType.GROUP, null);
  }

  public static from(api: dialog.Peer | dialog.OutPeer) {
    const strId = getOpt(api.strId, null) || null;
    switch (api.type) {
      case dialog.PeerType.PEERTYPE_PRIVATE:
        return new Peer(api.id, PeerType.PRIVATE, strId);

      case dialog.PeerType.PEERTYPE_GROUP:
        return new Peer(api.id, PeerType.GROUP, strId);

      case dialog.PeerType.PEERTYPE_SIP:
        return new Peer(api.id, PeerType.SIP, strId);

      default:
        return new Peer(api.id, PeerType.UNKNOWN, strId);
    }
  }

  protected constructor(id: number, type: PeerType, strId: string | null) {
    this.id = id;
    this.type = type;
    this.strId = strId;
  }

  public getKey() {
    return `${this.type}_${this.id}`;
  }

  public toString() {
    return `Peer(id=${this.id}, type=${this.type}, strId=${this.strId})`;
  }
}

export default Peer;
