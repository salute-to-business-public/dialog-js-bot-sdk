/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import ActionGroup from '../interactive/ActionGroup';

class TextContent {
  public readonly type = 'text';

  public static from(api: dialog.TextMessage) {
    const actions: Array<ActionGroup> = [];
    api.media.forEach((media) => {
      media.actions.forEach((action) => {
        actions.push(ActionGroup.from(action));
      })
    });

    return new TextContent(api.text, actions);
  }

  public static create(text: string, actions: Array<ActionGroup>) {
    return new TextContent(text, actions);
  }

  private constructor(
    public readonly text: string,
    public readonly actions: Array<ActionGroup>
  ) {
  }

  public toApi() {
    const media: dialog.MessageMedia[] = [];
    if (this.actions.length) {
      media.push(dialog.MessageMedia.create({
        actions: this.actions.map((action) => action.toApi())
      }));
    }

    return dialog.MessageContent.create({
      textMessage: dialog.TextMessage.create({
        media,
        text: this.text
      })
    });
  }
}

export default TextContent;
