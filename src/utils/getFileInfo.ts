/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const mime = require('mime/lite');

const stat = promisify(fs.stat);

export type FileInfo = {
  name: string,
  size: number,
  mime: string
};

/**
 * @private
 * @returns file size in bytes
 */
async function getFileInfo(fileName: string): Promise<FileInfo> {
  const stats = await stat(fileName);
  const name = path.basename(fileName);

  return {
    name,
    size: stats.size,
    mime: mime.getType(name)
  };
}

export default getFileInfo;
