/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Long from 'long';
import { dialog } from '@dlghq/dialog-api';

class FileLocation {
  private readonly id: Long;
  private readonly accessHash: Long;

  constructor(api: dialog.FileLocation) {
    this.id = api.fileId;
    this.accessHash = api.accessHash;
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
