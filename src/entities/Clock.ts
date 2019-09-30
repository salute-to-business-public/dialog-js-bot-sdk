/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Long from 'long';

class Clock {
  public readonly value: Long;

  public static from(value: Long) {
    return new Clock(value);
  }

  constructor(value: Long) {
    this.value = value;
  }

  toJSON() {
    return this.value.toString();
  }

  toString() {
    return this.value.toString();
  }
}

export default Clock;
