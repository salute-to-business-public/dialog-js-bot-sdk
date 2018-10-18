/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Long from 'long';
import { dialog } from '@dlghq/dialog-api';

const bytesToUuid: (bytes: number[]) => string = require('uuid/lib/bytesToUuid');

class UUID {
  private readonly msb: Long;
  private readonly lsb: Long;

  static from(api: dialog.UUIDValue) {
    return new UUID(api.msb, api.lsb);
  }

  constructor(msb: Long, lsb: Long) {
    this.msb = msb;
    this.lsb = lsb;
  }

  public toApi() {
    return new dialog.UUIDValue({
      msb: this.msb,
      lsb: this.lsb
    });
  }

  public toString() {
    return bytesToUuid([...this.msb.toBytes(), ...this.lsb.toBytes()]);
  }

  public toJSON() {
    return bytesToUuid([...this.msb.toBytes(), ...this.lsb.toBytes()]);
  }
}

export default UUID;
