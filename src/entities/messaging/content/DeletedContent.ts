/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';

class DeletedContent {
  public readonly type = 'deleted';

  public static from(api: dialog.DeletedMessage) {
    return new DeletedContent();
  }

  public static create() {
    return new DeletedContent();
  }

  public toApi() {
    return dialog.MessageContent.create({
      deletedMessage: dialog.DeletedMessage.create()
    });
  }
}

export default DeletedContent;
