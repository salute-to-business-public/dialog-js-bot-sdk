/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';

class DocumentVoiceExtension {
  public readonly type = 'voice';
  public readonly duration: number;

  public static from(api: dialog.DocumentExVoice) {
    return new DocumentVoiceExtension(api.duration);
  }

  private constructor(duration: number) {
    this.duration = duration;
  }
}

export default DocumentVoiceExtension;
