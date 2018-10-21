/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';

class DocumentVideoExtension {
  public readonly type = 'video';
  public readonly width: number;
  public readonly height: number;
  public readonly duration: number;

  public static from(api: dialog.DocumentExVideo) {
    return new DocumentVideoExtension(api.w, api.h, api.duration);
  }

  private constructor(width: number, height: number, duration: number) {
    this.width = width;
    this.height = height;
    this.duration = duration;
  }

  public toApi() {
    return dialog.DocumentEx.create({
      video: dialog.DocumentExVideo.create({
        w: this.width,
        h: this.height,
        duration: this.duration
      })
    });
  }
}

export default DocumentVideoExtension;
