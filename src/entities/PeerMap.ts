/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Peer from './Peer';
import PeerType from './PeerType';

class PeerMap<T> {
  private readonly sips: Map<string, T> = new Map();
  private readonly groups: Map<number, T> = new Map();
  private readonly privates: Map<number, T> = new Map();

  clear(): void {
    this.sips.clear();
    this.groups.clear();
    this.privates.clear();
  }

  delete(peer: Peer): boolean {
    switch (peer.type) {
      case PeerType.SIP:
        return peer.strId ? this.sips.delete(peer.strId) : false;

      case PeerType.GROUP:
        return this.groups.delete(peer.id);

      case PeerType.PRIVATE:
        return this.privates.delete(peer.id);

      default:
        return false;
    }
  }

  forEach(iterator: (value: T, peer: Peer) => void): void {
    this.sips.forEach((value, strId) => iterator(value, Peer.sip(strId)));
    this.groups.forEach((value, id) => iterator(value, Peer.group(id)));
    this.privates.forEach((value, id) => iterator(value, Peer.private(id)));
  }

  get(peer: Peer): T | undefined {
    switch (peer.type) {
      case PeerType.SIP:
        return peer.strId ? this.sips.get(peer.strId) : undefined;

      case PeerType.GROUP:
        return this.groups.get(peer.id);

      case PeerType.PRIVATE:
        return this.privates.get(peer.id);

      default:
        return undefined;
    }
  }

  has(peer: Peer): boolean {
    switch (peer.type) {
      case PeerType.SIP:
        return peer.strId ? this.sips.has(peer.strId) : false;

      case PeerType.GROUP:
        return this.groups.has(peer.id);

      case PeerType.PRIVATE:
        return this.privates.has(peer.id);

      default:
        return false;
    }
  }

  set(peer: Peer, value: T): this {
    switch (peer.type) {
      case PeerType.SIP:
        if (peer.strId) {
          this.sips.set(peer.strId, value);
          return this;
        }

        throw new Error('strId must be set for SIP peers');

      case PeerType.GROUP:
        this.groups.set(peer.id, value);
        return this;

      case PeerType.PRIVATE:
        this.privates.set(peer.id, value);
        return this;

      default:
        throw new Error('PeerMap doesn\'t support unknown types');
    }
  }
}

export default PeerMap;
