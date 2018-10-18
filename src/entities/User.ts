/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Long from 'long';
import Record from 'dataclass';
import { dialog } from '@dlghq/dialog-api';
import { getOpt } from './utils';

class User extends Record<User> {
  id: number = -1;
  accessHash: Long = Long.ZERO;
  name: string = 'UNKNOWN';
  isBot: boolean = false;
  nick: null | string = null;

  static from(api: dialog.User) {
    return new User({
      id: api.id,
      accessHash: api.accessHash,
      name: api.name,
      isBot: getOpt(api.isBot, false),
      nick: getOpt(api.nick, null)
    });
  }
}

export default User;
