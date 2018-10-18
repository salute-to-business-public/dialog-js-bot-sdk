/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';

export type Entities = {
  users: dialog.User[],
  groups: dialog.Group[]
};

export type PeerEntities = {
  users: dialog.UserOutPeer[],
  groups: dialog.GroupOutPeer[]
};

export type ResponseEntities<T> = {
  payload: T,
  users: dialog.User[],
  groups: dialog.Group[],
  userPeers: dialog.UserOutPeer[],
  groupPeers: dialog.GroupOutPeer[]
}
