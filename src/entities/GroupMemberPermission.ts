/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Long from 'long';
import Record from 'dataclass';
import { dialog, google } from '@dlghq/dialog-api';
import { getOpt } from './utils';
import UUID from './UUID';
import Avatar from './Avatar';

enum GroupPermission {
  UNKNOWN,
  EDIT_SHORTNAME,
  INVITE,
  KICK,
  UPDATE_INFO,
  SET_PERMISSIONS,
  EDIT_MESSAGE,
  DELETE_MESSAGE,
  GET_INTEGRATION_TOKEN,
  SEND_MESSAGE,
  PIN_MESSAGE,
}

export default GroupPermission;
