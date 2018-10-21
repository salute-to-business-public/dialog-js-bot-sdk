/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog, google } from '@dlghq/dialog-api';
import { getOpt } from '../../utils';

type Props = {
  text: null | string,
  title: null | string,
  ok: null | string,
  dismiss: null | string
};

class ActionConfirm {
  public static from(api: dialog.InteractiveMediaConfirm) {
    return new ActionConfirm(
      getOpt(api.text, null),
      getOpt(api.title, null),
      getOpt(api.ok, null),
      getOpt(api.dismiss, null)
    );
  }

  public static create({ text, title = null, ok = null, dismiss = null }: Props) {
    return new ActionConfirm(text, title, ok, dismiss);
  }

  private constructor(
    public readonly text: null | string,
    public readonly title: null | string,
    public readonly ok: null | string,
    public readonly dismiss: null | string
  ) {
  }

  public toApi() {
    return dialog.InteractiveMediaConfirm.create({
      text: this.text ? google.protobuf.StringValue.create({ value: this.text }) : null,
      title: this.title ? google.protobuf.StringValue.create({ value: this.title }) : null,
      ok: this.ok ? google.protobuf.StringValue.create({ value: this.ok }) : null,
      dismiss: this.dismiss ? google.protobuf.StringValue.create({ value: this.dismiss }) : null
    });
  }
}

export default ActionConfirm;
