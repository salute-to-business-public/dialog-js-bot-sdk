/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { credentials } from 'grpc';

function createCredentials(url: URL) {
  switch (url.protocol) {
    case 'http:':
      return credentials.createInsecure();

    case 'https:':
      return credentials.createSsl();

    default:
      throw new Error(`Unsupported endpoint protocol: ${url.protocol}`);
  }
}

export default createCredentials;
