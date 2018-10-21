/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import Peer from '../Peer';
import UUID from '../UUID';
import { Content, apiToContent } from './content';
import MessageAttachment from './MessageAttachment';

class Message {
  /**
   * Message id.
   */
  public readonly id: UUID;

  /**
   * Peer of the chat which contains message.
   */
  public readonly peer: Peer;

  /**
   * Message date.
   */
  public readonly date: Date;

  /**
   * Message content.
   */
  public readonly content: Content;

  /**
   * Message attachment.
   */
  public readonly attachment: null | MessageAttachment;

  static from(api: dialog.UpdateMessage) {
    if (!api.mid) {
      throw new Error('Message unexpectedly doesn\'t have id');
    }

    if (!api.peer) {
      throw new Error('Message unexpectedly doesn\'t have peer');
    }

    if (!api.message) {
      throw new Error('Message unexpectedly doesn\'t have content');
    }

    return new Message(
      UUID.from(api.mid),
      Peer.from(api.peer),
      new Date(api.date.toInt()),
      apiToContent(api.message),
      MessageAttachment.from(api.reply, api.forward)
    );
  }

  constructor(
    id: UUID,
    peer: Peer,
    date: Date,
    content: Content,
    attachment: null | MessageAttachment
  ) {
    this.id = id;
    this.peer = peer;
    this.date = date;
    this.content = content;
    this.attachment = attachment;
  }
}

export default Message;
