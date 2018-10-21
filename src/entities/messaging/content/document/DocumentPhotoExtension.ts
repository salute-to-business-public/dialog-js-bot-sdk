/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';

class DocumentPhotoExtension {
  public readonly type = 'photo';
  public readonly width: number;
  public readonly height: number;

  public static from(api: dialog.DocumentExPhoto) {
    return new DocumentPhotoExtension(api.w, api.h);
  }

  private constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

export default DocumentPhotoExtension;
