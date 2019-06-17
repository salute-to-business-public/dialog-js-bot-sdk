/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Long from 'long';

function parseDateFromLong(date: Long): Date {
  return new Date(parseInt(date.toString(), 10));
}

export default parseDateFromLong;
