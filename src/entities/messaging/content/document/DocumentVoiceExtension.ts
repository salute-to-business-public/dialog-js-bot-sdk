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

  public toApi() {
    return dialog.DocumentEx.create({
      voice: dialog.DocumentExVoice.create({
        duration: this.duration
      })
    });
  }
}

export default DocumentVoiceExtension;
