/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import crypto from 'crypto';
import { promisify } from 'util';
import Long from 'long';

const randomBytes = promisify(crypto.randomBytes);

async function randomLong() {
  const bytes = await randomBytes(8);

  // @ts-ignore
  return Long.fromBytes(bytes);
}

export default randomLong;
