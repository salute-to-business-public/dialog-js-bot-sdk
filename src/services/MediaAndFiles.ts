/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Bluebird from 'bluebird';
import fetch from 'node-fetch';
import { ChannelCredentials, Metadata, ClientReadableStream } from 'grpc';
import { dialog, google } from '@dlghq/dialog-api';
import { Observable, Subscriber } from 'rxjs';

class MediaAndFiles {
  private readonly service: any;

  constructor(endpoint: string, credentials: ChannelCredentials) {
    // @ts-ignore
    this.service = Bluebird.promisifyAll(new dialog.MediaAndFiles(endpoint, credentials));
  }

  public getFileUrls(
    request: dialog.RequestGetFileUrls,
    metadata: Metadata
  ): Promise<dialog.ResponseGetFileUrls> {
    return this.service.getFileUrlsAsync(request, metadata);
  }

  public getFileUploadUrl(
    request: dialog.RequestGetFileUploadUrl,
    metadata: Metadata
  ): Promise<dialog.ResponseGetFileUploadUrl> {
    return this.service.getFileUploadUrlAsync(request, metadata);
  }

  public getFileUploadPartUrl(
    request: dialog.RequestGetFileUploadPartUrl,
    metadata: Metadata
  ): Promise<dialog.ResponseGetFileUploadPartUrl> {
    return this.service.getFileUploadPartUrlAsync(request, metadata);
  }

  public commitFileUpload(
    request: dialog.RequestCommitFileUpload,
    metadata: Metadata
  ): Promise<dialog.ResponseCommitFileUpload> {
    return this.service.commitFileUploadAsync(request, metadata);
  }

  public async uploadChunk(url: string, content: Buffer): Promise<void> {
    const res = await fetch(url, {
      body: content,
      method: 'PUT',
      headers: { 'Content-Type': 'application/octet-stream' }
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }
  }
}

export default MediaAndFiles;
