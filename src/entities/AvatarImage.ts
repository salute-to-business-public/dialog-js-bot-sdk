/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import FileLocation from './files/FileLocation';

class AvatarImage {
  public readonly width: number;
  public readonly height: number;
  public readonly size: number;
  public readonly location: null | FileLocation;

  constructor(api: dialog.AvatarImage) {
    this.width = api.width;
    this.height = api.height;
    this.size = api.fileSize;
    this.location = api.fileLocation
      ? FileLocation.from(api.fileLocation)
      : null;
  }

  public toApi() {
    return new dialog.AvatarImage({
      width: this.width,
      height: this.height,
      fileSize: this.size,
      fileLocation: this.location ? this.location.toApi() : null,
    });
  }

  public toString() {
    return `AvatarImage {width=${this.width}, height=${this.height}, size=${this.size}, location=${this.location}}`;
  }
}

export default AvatarImage;
