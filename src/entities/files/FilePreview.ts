/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';

class FilePreview {
  /**
   * Preview width.
   */
  private readonly width: number;

  /**
   * Preview height;
   */
  private readonly height: number;

  /**
   * Preview content in PNG format.
   */
  private readonly content: Uint8Array;

  public static from(api: dialog.FastThumb) {
    return new FilePreview(api.w, api.h, api.thumb);
  }

  constructor(width: number, height: number, content: Uint8Array) {
    this.width = width;
    this.height = height;
    this.content = content;
  }

  public toApi() {
    return new dialog.FastThumb({
      w: this.width,
      h: this.height,
      thumb: this.content
    });
  }
}

export default FilePreview;
