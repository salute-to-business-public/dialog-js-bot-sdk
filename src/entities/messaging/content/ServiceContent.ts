/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';

class ServiceContent {
  public readonly type = 'service';

  public static from(api: dialog.ServiceMessage) {
    return new ServiceContent(api.text, api.ext || null);
  }

  constructor(
    public readonly text: string,
    public readonly extension: null | dialog.ServiceEx
  ) {
  }
}

export default ServiceContent;
