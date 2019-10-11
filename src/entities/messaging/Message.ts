/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import Peer from '../Peer';
import UUID from '../UUID';
import { Content, apiToContent } from './content';
import MessageAttachment from './MessageAttachment';
import parseDateFromLong from '../../utils/parseDateFromLong';

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

  static from(api: dialog.UpdateMessage) {
    if (!api.mid) {
      throw new Error("Message unexpectedly doesn't have id");
    }

    if (!api.peer) {
      throw new Error("Message unexpectedly doesn't have peer");
    }

    if (!api.message) {
      throw new Error("Message unexpectedly doesn't have content");
    }

    return new Message(
      UUID.from(api.mid),
      Peer.from(api.peer),
      parseDateFromLong(api.date),
      apiToContent(api.message),
      MessageAttachment.from(api.reply, api.forward),
      api.senderUid,
    );
  }

  constructor(
    id: UUID,
    peer: Peer,
    date: Date,
    content: Content,
    attachment: null | MessageAttachment,
    senderUserId: number,
  ) {
    this.id = id;
    this.peer = peer;
    this.date = date;
    this.content = content;
    this.attachment = attachment;
    this.senderUserId = senderUserId;
  }
}

export default Message;
