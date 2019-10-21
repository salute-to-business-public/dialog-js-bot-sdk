/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { Peer, Content } from '../entities';

class MessageRejectedError extends Error {
  readonly name = 'MessageRejected';
  readonly peer: Peer;
  readonly content: Content;
  readonly hookId: string;
  readonly reason: string | null;

  constructor(
    peer: Peer,
    content: Content,
    hookId: string,
    reason: string | null,
  ) {
    super(`Message rejected by hook #${hookId}`);

    this.peer = peer;
    this.content = content;
    this.hookId = hookId;
    this.reason = reason;
  }
}

export default MessageRejectedError;
