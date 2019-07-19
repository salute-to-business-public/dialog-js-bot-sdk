/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Long from 'long';
import { dialog, google } from '@dlghq/dialog-api';

class GroupMember {
  /** User id */
  uid?: number | null;

  /** User inviter id */
  inviterUid?: number | null;

  /** Adding date */
  date?: Long | null;

  /** Member isAdmin */
  isAdmin?: google.protobuf.BoolValue | null;

  /** List of member permissions */
  permissions?: dialog.GroupAdminPermission[] | null;
}

export default GroupMember;
