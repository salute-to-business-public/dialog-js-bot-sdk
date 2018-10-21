/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';

class ServiceContent {
  public readonly type = 'service';
  public readonly text: string;
  public readonly extension: null | dialog.ServiceEx;

  public static from(api: dialog.ServiceMessage) {
    return new ServiceContent(api.text, api.ext || null);
  }

  constructor(text: string, extension: null | dialog.ServiceEx) {
    this.text = text;
    this.extension = extension;
  }
}

export default ServiceContent;
