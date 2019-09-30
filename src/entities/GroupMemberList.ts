/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import GroupMember from './GroupMember';

class GroupMemberList {
  public readonly count: number = 0;
  public readonly items: Array<GroupMember> = [];
  public readonly isLoaded: boolean = false;

  public static from(api: dialog.Group) {
    return new GroupMemberList(api);
  }

  constructor(api: dialog.Group) {
    if (api.data) {
      this.count = api.data.membersAmount;
    }

    if (api.selfMember) {
      this.items.push(GroupMember.from(api.selfMember));
    }
  }
}

export default GroupMemberList;
