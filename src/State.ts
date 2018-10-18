/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import { Peer, User, Group } from './entities';
import { Entities, PeerEntities, ResponseEntities } from './internal/types';
import mapNotNull from './utils/mapNotNull';

class State {
  public readonly self: User;
  private readonly users: Map<number, User> = new Map();
  private readonly groups: Map<number, Group> = new Map();
  private readonly dialogs: Array<Peer> = [];

  constructor(self: User) {
    this.self = self;
  }

  applyDialogs(dialogs: dialog.Dialog[]) {
    const mapped = mapNotNull(dialogs, (dialog) => dialog.peer ? Peer.from(dialog.peer) : null);
    this.dialogs.push(...mapped);
  }

  applyEntities({ users, groups }: Entities) {
    users.forEach((apiUser) => {
      if (!this.users.has(apiUser.id)) {
        const user = User.from(apiUser);
        this.users.set(user.id, user);
      }
    });

    groups.forEach((apiGroup) => {
      if (!this.groups.has(apiGroup.id)) {
        const group = Group.from(apiGroup);
        this.groups.set(group.id, group);
      }
    });
  }

  applyResponseEntities({ users, groups, userPeers, groupPeers }: ResponseEntities<any>): PeerEntities {
    this.applyEntities({ users, groups });

    return {
      users: userPeers.filter((peer) => !this.users.has(peer.uid)),
      groups: groupPeers.filter((peer) => !this.groups.has(peer.groupId))
    };
  }
}

export default State;
