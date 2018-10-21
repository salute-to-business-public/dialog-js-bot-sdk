/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import Jimp from 'jimp';
import { FilePreview, DocumentPhotoExtension } from '../entities';

/**
 * @private
 */
async function createImagePreview(fileName: string) {
  const image = await Jimp.read(fileName);
  const extension = DocumentPhotoExtension.create(image.bitmap.width, image.bitmap.height);

  const preview = image.resize(Jimp.AUTO, 100).quality(60);
  const content = await preview.getBufferAsync('image/jpeg');

  return {
    extension,
    preview: FilePreview.create(preview.bitmap.width, preview.bitmap.height, content)
  };
}

export default createImagePreview;
