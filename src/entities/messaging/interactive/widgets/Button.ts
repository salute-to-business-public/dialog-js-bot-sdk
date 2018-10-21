/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import uuid from 'uuid/v4';
import { dialog, google } from '@dlghq/dialog-api';
import { getOpt } from '../../../utils';

type Props = {
  label: string,
  value?: string
};

class Button {
  public static from(api: dialog.InteractiveMediaButton) {
    return new Button(getOpt(api.label, ''), api.value);
  }

  public static create({ label, value = uuid() }: Props) {
    return new Button(label, value);
  }

  private constructor(
    public readonly label: string,
    public readonly value: string
  ) {
  }

  public toApi() {
    return dialog.InteractiveMediaWidget.create({
      interactiveMediaButton: dialog.InteractiveMediaButton.create({
        value: this.value,
        label: google.protobuf.StringValue.create({ value: this.label })
      })
    });
  }
}

export default Button;
