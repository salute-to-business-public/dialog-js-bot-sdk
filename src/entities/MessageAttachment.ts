/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import UUID from './UUID';

enum MessageAttachmentType {
  REPLY = 'reply',
  FORWARD = 'forward'
}

class MessageAttachment {
  /**
   * Attachment type.
   */
  public readonly type: MessageAttachmentType;

  /**
   * Attachment message identifiers.
   */
  public readonly mids: Array<UUID>;

  public static from(
    reply?: null | dialog.ReferencedMessages,
    forward?: null | dialog.ReferencedMessages
  ) {
    if (reply) {
      return new MessageAttachment(MessageAttachmentType.REPLY, reply.mids.map(UUID.from));
    }

    if (forward) {
      return new MessageAttachment(MessageAttachmentType.FORWARD, forward.mids.map(UUID.from));
    }

    return null;
  }

  constructor(type: MessageAttachmentType, mids: Array<UUID>) {
    this.type = type;
    this.mids = mids;
  }
}

export default MessageAttachment;
