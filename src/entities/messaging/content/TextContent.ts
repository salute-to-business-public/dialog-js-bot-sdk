/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import MessageAction from './actions/MessageAction';

class TextContent {
  public readonly type = 'text';
  public readonly text: string;
  public readonly actions: Array<MessageAction>;

  public static from(api: dialog.TextMessage) {
    return new TextContent(api.text, []);
  }

  public static create(text: string, actions: Array<MessageAction>) {
    return new TextContent(text, actions);
  }

  private constructor(text: string, actions: Array<MessageAction>) {
    this.text = text;
    this.actions = actions;
  }

  public toApi() {
    return dialog.MessageContent.create({
      textMessage: dialog.TextMessage.create({
        text: this.text
      })
    });
  }
}

export default TextContent;
