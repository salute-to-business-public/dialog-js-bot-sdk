/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import AvatarImage from './AvatarImage';

class Avatar {
  private readonly full: null | AvatarImage;
  private readonly small: null | AvatarImage;
  private readonly large: null | AvatarImage;

  constructor(api: dialog.Avatar) {
    this.full = api.fullImage ? new AvatarImage(api.fullImage) : null;
    this.small = api.smallImage ? new AvatarImage(api.smallImage) : null;
    this.large = api.largeImage ? new AvatarImage(api.largeImage) : null;
  }

  public toApi() {
    return new dialog.Avatar({
      fullImage: this.full ? this.full.toApi() : null,
      smallImage: this.small ? this.small.toApi() : null,
      largeImage: this.large ? this.large.toApi() : null
    });
  }

  public toString() {
    return `AvatarImage {full=${this.full}, small=${this.small}, large=${this.large}}`;
  }
}

export default Avatar;
