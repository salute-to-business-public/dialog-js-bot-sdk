/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Long from 'long';
import { dialog, google } from '@dlghq/dialog-api';
import { getOpt } from './utils';
import UUID from './UUID';
import Avatar from './Avatar';
import GroupMemberList from './GroupMemberList';
import { GroupType } from './GroupType';

class Group {
  public readonly id: number;
  public readonly type: GroupType;
  public readonly spaceId: null | UUID;
  public readonly ownerId: number;
  public readonly accessHash: Long;
  public readonly title: string;
  public readonly avatar: null | Avatar;
  public readonly memebers: GroupMemberList;
  public readonly createdAt: Date;
  public readonly about?: null | string;

  public static from(api: dialog.Group) {
    return new Group(api);
  }

  constructor(api: dialog.Group) {
    this.id = api.id;
    this.type = GroupType.from(api);
    this.spaceId = api.spaceId ? UUID.from(api.spaceId) : null;
    this.ownerId = api.creatorUid;
    this.accessHash = api.accessHash;
    this.title = api.title;
    this.avatar = api.avatar ? new Avatar(api.avatar) : null;
    this.memebers = new GroupMemberList({
      count: getOpt(api.membersAmount, 0),
    });
    this.createdAt = new Date(api.createDate.toInt());
    this.about = getOpt(api.about, null);
  }
}

export default Group;
