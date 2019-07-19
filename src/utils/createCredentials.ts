/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { credentials } from 'grpc';

export type SSLConfig = {
  // The root certificate data
  rootCerts?: Buffer;
  // The client certificate private key, if applicable
  privateKey?: Buffer;
  // The client certificate cert chain, if applicable
  certChain?: Buffer;
};

function createCredentials(url: URL, ssl: SSLConfig | void) {
  switch (url.protocol) {
    case 'http:':
      return credentials.createInsecure();

    case 'https:':
      if (ssl) {
        return credentials.createSsl(
          ssl.rootCerts,
          ssl.privateKey,
          ssl.certChain,
        );
      }

      return credentials.createSsl();

    default:
      throw new Error(`Unsupported endpoint protocol: ${url.protocol}`);
  }
}

export default createCredentials;
