/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import UUID from '../UUID';
import Message from './Message';
import normalizeArray from '../../utils/normalizeArray';

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

  public static reply(mids: UUID | Array<UUID>) {
    return new MessageAttachment(MessageAttachmentType.REPLY, normalizeArray(mids));
  }

  public static forward(mids: UUID | Array<UUID>) {
    return new MessageAttachment(MessageAttachmentType.FORWARD, normalizeArray(mids));
  }

  private constructor(type: MessageAttachmentType, mids: Array<UUID>) {
    this.type = type;
    this.mids = mids;
  }

  public toReplyApi(): null | dialog.ReferencedMessages {
    if (this.type === MessageAttachmentType.REPLY) {
      return dialog.ReferencedMessages.create({ mids: this.mids.map((mid) => mid.toApi()) });
    }

    return null;
  }

  public toForwardApi(): null | dialog.ReferencedMessages {
    if (this.type === MessageAttachmentType.FORWARD) {
      return dialog.ReferencedMessages.create({ mids: this.mids.map((mid) => mid.toApi()) });
    }

    return null;
  }
}

export default MessageAttachment;
