/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import Peer from '../Peer';
import UUID from '../UUID';
import { Content, apiToContent } from './content';
import MessageAttachment from './MessageAttachment';
import parseDateFromLong from '../../utils/parseDateFromLong';
import { UnexpectedApiError } from '../../errors';

class Message {
  /**
   * The message id.
   */
  public readonly id: UUID;

  /**
   * The peer of the chat which contains message.
   */
  public readonly peer: Peer;

  /**
   * The message date.
   */
  public readonly date: Date;

  /**
   * The message content.
   */
  public readonly content: Content;

  /**
   * The message attachment.
   */
  public readonly attachment: null | MessageAttachment;

  /**
   * The id of the user who sent the message.
   */
  public readonly senderUserId: number;

  /**
   * The message last edit time.
   */
  public readonly editedAt: Date;

  static from(api: dialog.UpdateMessage) {
    if (!api.mid) {
      throw new UnexpectedApiError('mid');
    }

    if (!api.peer) {
      throw new UnexpectedApiError('peer');
    }

    if (!api.message) {
      throw new UnexpectedApiError('message');
    }

    return new Message(
      UUID.from(api.mid),
      Peer.from(api.peer),
      parseDateFromLong(api.date),
      apiToContent(api.message),
      MessageAttachment.from(api.reply, api.forward),
      api.senderUid,
      parseDateFromLong(api.date),
    );
  }

  constructor(
    id: UUID,
    peer: Peer,
    date: Date,
    content: Content,
    attachment: null | MessageAttachment,
    senderUserId: number,
    editedAt: Date,
  ) {
    this.id = id;
    this.peer = peer;
    this.date = date;
    this.content = content;
    this.attachment = attachment;
    this.senderUserId = senderUserId;
    this.editedAt = editedAt;
  }
}

export default Message;
