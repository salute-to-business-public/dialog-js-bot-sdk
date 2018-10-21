/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import DocumentPhotoExtension from './DocumentPhotoExtension';
import DocumentVideoExtension from './DocumentVideoExtension';
import DocumentVoiceExtension from './DocumentVoiceExtension';

export type DocumentExtension =
  | DocumentPhotoExtension
  | DocumentVideoExtension
  | DocumentVoiceExtension;

export {
  DocumentPhotoExtension,
  DocumentVideoExtension,
  DocumentVoiceExtension
}

/**
 * @private
 */
export function apiToDocumentExtension(api: dialog.DocumentEx): null | DocumentExtension {
  if (api.photo) {
    return DocumentPhotoExtension.from(api.photo);
  }

  if (api.video) {
    return DocumentVideoExtension.from(api.video);
  }

  if (api.voice) {
    return DocumentVoiceExtension.from(api.voice);
  }

  return null;
}

