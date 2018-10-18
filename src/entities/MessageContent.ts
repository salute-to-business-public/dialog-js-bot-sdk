/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';

class MessageContent {
  public readonly content: dialog.MessageContent;

  public static from(api: dialog.MessageContent) {
    return new MessageContent(api);
  }

  constructor(content: dialog.MessageContent) {
    this.content = content;
  }
}

export default MessageContent;
