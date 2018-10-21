/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import uuid from 'uuid/v4';
import { dialog, google } from '@dlghq/dialog-api';

type Props = {
  label: string,
  value?: string
};

class SelectOption {
  public static from(api: dialog.InteractiveMediaSelectOption) {
    return new SelectOption(api.label, api.value);
  }

  public static create({ label, value = uuid() }: Props) {
    return new SelectOption(label, value);
  }

  private constructor(
    public readonly label: string,
    public readonly value: string
  ) {
  }

  public toApi() {
    return dialog.InteractiveMediaSelectOption.create({
      label: this.label,
      value: this.value
    });
  }
}

export default SelectOption;
