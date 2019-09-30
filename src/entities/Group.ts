/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Long from 'long';
import { dialog } from '@dlghq/dialog-api';
import GroupData from './GroupData';
import GroupMemberList from './GroupMemberList';

class Group {
  public readonly id: number;
  public readonly data: GroupData | null;
  public readonly members: GroupMemberList;
  public readonly accessHash: Long;

  public static from(api: dialog.Group) {
    return new Group(api);
  }

  constructor(api: dialog.Group) {
    this.id = api.id;
    this.data = api.data ? GroupData.from(api.data) : null;
    this.accessHash = api.accessHash;
    this.members = GroupMemberList.from(api);
  }
}

export default Group;
