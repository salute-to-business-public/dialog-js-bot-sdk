/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import FileLocation from '../../files/FileLocation';
import FilePreview from '../../files/FilePreview';
import { DocumentExtension, apiToDocumentExtension } from './document';

class DocumentContent {
  public readonly type = 'document';
  public readonly name: string;
  public readonly size: number;
  public readonly mime: string;
  public readonly preview: null | FilePreview;
  public readonly location: FileLocation;
  public readonly extension: null | DocumentExtension;

  public static from(api: dialog.DocumentMessage) {
    return new DocumentContent(
      api.name,
      api.fileSize,
      api.mimeType,
      api.thumb ? FilePreview.from(api.thumb) : null,
      FileLocation.create(api.fileId, api.accessHash),
      api.ext ? apiToDocumentExtension(api.ext) : null
    );
  }

  public static create(
    name: string,
    size: number,
    mime: string,
    preview: null | FilePreview,
    location: FileLocation,
    extension: null | DocumentExtension
  ) {
    return new DocumentContent(name, size, mime, preview, location, extension);
  }

  private constructor(
    name: string,
    size: number,
    mime: string,
    preview: null | FilePreview,
    location: FileLocation,
    extension: null | DocumentExtension
  ) {
    this.name = name;
    this.size = size;
    this.mime = mime;
    this.preview = preview;
    this.location = location;
    this.extension = extension;
  }

  public toApi() {
    return dialog.MessageContent.create({
      documentMessage: dialog.DocumentMessage.create({
        name: this.name,
        thumb: this.preview ? this.preview.toApi() : null,
        fileId: this.location.id,
        fileSize: this.size,
        mimeType: this.mime,
        accessHash: this.location.accessHash,
        ext: this.extension ? this.extension.toApi() : null
      })
    });
  }
}

export default DocumentContent;
