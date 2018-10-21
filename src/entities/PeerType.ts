/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api/js';

enum PeerType {
  UNKNOWN = 'unknown',
  PRIVATE = 'private',
  GROUP = 'group',
  SIP = 'sip'
}

export function peerTypeToApi(type: PeerType): dialog.PeerType {
  switch (type) {
    case PeerType.PRIVATE:
      return dialog.PeerType.PEERTYPE_PRIVATE;
    case PeerType.GROUP:
      return dialog.PeerType.PEERTYPE_GROUP;
    case PeerType.SIP:
      return dialog.PeerType.PEERTYPE_SIP;
    default:
      return dialog.PeerType.PEERTYPE_UNKNOWN;
  }
}

export default PeerType;
