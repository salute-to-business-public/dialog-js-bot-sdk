/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Record from 'dataclass';

class GroupMemberList extends Record<GroupMemberList> {
  public readonly count: number = 0;
  public readonly isLoaded: boolean = false;
}

export default GroupMemberList;
