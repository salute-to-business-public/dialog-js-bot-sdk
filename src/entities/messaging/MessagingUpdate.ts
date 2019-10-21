/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import Peer from '../Peer';
import UUID from '../UUID';
import { Content, apiToContent } from './content';
import Message from './Message';
import { UnexpectedApiError } from '../../errors';
import { dateFromLong } from '../utils';

export type MessagingUpdateNewMessage = {
  type: 'new';
  payload: Message;
};

export type UpdateEditMessage = {
  id: UUID;
  peer: Peer;
  content: Content;
  editedAt: Date;
};

export type MessagingUpdateEditMessage = {
  type: 'edit';
  payload: UpdateEditMessage;
};

export type MessagingUpdate =
  | MessagingUpdateNewMessage
  | MessagingUpdateEditMessage;

function updateMessageFromApi(
  api: dialog.UpdateMessage,
): MessagingUpdateNewMessage {
  return {
    type: 'new',
    payload: Message.from(api),
  };
}

function editMessageFromApi(
  api: dialog.UpdateMessageContentChanged,
): MessagingUpdateEditMessage {
  if (!api.mid) {
    throw new UnexpectedApiError('mid');
  }

  if (!api.peer) {
    throw new UnexpectedApiError('peer');
  }

  if (!api.message) {
    throw new UnexpectedApiError('message');
  }

  return {
    type: 'edit',
    payload: {
      id: UUID.from(api.mid),
      peer: Peer.from(api.peer),
      content: apiToContent(api.message),
      editedAt: dateFromLong(api.editedAt),
    },
  };
}

export function parseMessagingUpdate(
  api: dialog.UpdateSeqUpdate,
): MessagingUpdate | null {
  if (api.updateMessage) {
    return updateMessageFromApi(api.updateMessage);
  }

  if (api.updateMessageContentChanged) {
    return editMessageFromApi(api.updateMessageContentChanged);
  }

  return null;
}
