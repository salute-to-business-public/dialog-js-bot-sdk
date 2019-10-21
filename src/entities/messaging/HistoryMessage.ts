/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import UUID from '../UUID';
import { Content, apiToContent } from './content';
import MessageAttachment from './MessageAttachment';
import OutPeer from '../OutPeer';
import parseDateFromLong from '../../utils/parseDateFromLong';
import { getOpt } from '../utils';

class HistoryMessage {
  static from(api: dialog.HistoryMessage) {
    if (!api.mid) {
      throw new Error("Message unexpectedly doesn't have id");
    }

    if (!api.message) {
      throw new Error("Message unexpectedly doesn't have content");
    }

    return new HistoryMessage(
      UUID.from(api.mid),
      api.hostPeer ? OutPeer.from(api.hostPeer) : null,
      api.senderUid,
      api.senderPeer ? OutPeer.from(api.senderPeer) : null,
      parseDateFromLong(api.date),
      apiToContent(api.message),
      MessageAttachment.from(api.reply, api.forward),
      parseDateFromLong(getOpt(api.editedAt, api.date)),
    );
  }

  constructor(
    public readonly id: UUID,
    public readonly peer: null | OutPeer,
    public readonly senderUserId: number,
    public readonly senderPeer: null | OutPeer,
    public readonly date: Date,
    public readonly content: Content,
    public readonly attachment: null | MessageAttachment,
    public readonly editedAt: Date,
  ) {}
}

export default HistoryMessage;
