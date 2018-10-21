/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import TextContent from './TextContent';
import ServiceContent from './ServiceContent';
import DocumentContent from './DocumentContent';
import UnknownContent from './UnknownContent';

export type Content = TextContent | ServiceContent | DocumentContent | UnknownContent;

export {
  TextContent,
  ServiceContent,
  DocumentContent,
  UnknownContent
}

/**
 * @private
 */
export function apiToContent(api: dialog.MessageContent): Content {
  if (api.textMessage) {
    return TextContent.from(api.textMessage);
  }

  if (api.serviceMessage) {
    return ServiceContent.from(api.serviceMessage);
  }

  if (api.documentMessage) {
    return DocumentContent.from(api.documentMessage);
  }

  return UnknownContent.create();
}

/**
 * @private
 */
export function contentToApi(content: Content): dialog.MessageContent {
  switch (content.type) {
    case 'text':
    case 'document':
      return content.toApi();

    default:
      throw Error(`Unexpected content type "${content.type}"`);
  }
}
