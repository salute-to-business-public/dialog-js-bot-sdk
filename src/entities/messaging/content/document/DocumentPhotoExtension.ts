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

  public static create(width: number, height: number) {
    return new DocumentPhotoExtension(width, height);
  }

  private constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public toApi() {
    return dialog.DocumentEx.create({
      photo: dialog.DocumentExPhoto.create({
        w: this.width,
        h: this.height
      })
    });
  }
}

export default DocumentPhotoExtension;
