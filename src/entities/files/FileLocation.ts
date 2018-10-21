/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Long from 'long';
import { dialog } from '@dlghq/dialog-api';

class FileLocation {
  public readonly id: Long;
  public readonly accessHash: Long;

  public static from(api: dialog.FileLocation) {
    return new FileLocation(api.fileId, api.accessHash);
  }

  public static create(id: Long, accessHash: Long) {
    return new FileLocation(id, accessHash);
  }

  protected constructor(id: Long, accessHash: Long) {
    this.id = id;
    this.accessHash = accessHash;
  }

  public toApi() {
    return new dialog.FileLocation({
      fileId: this.id,
      accessHash: this.accessHash
    });
  }

  public toString() {
    return `FileLocation {id=${this.id.toString()}`;
  }
}

export default FileLocation;
