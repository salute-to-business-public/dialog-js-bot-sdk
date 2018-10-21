/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog, google } from '@dlghq/dialog-api';
import { getOpt } from '../../../utils';
import SelectOption from './SelectOption';

type Props = {
  label: string,
  options: Array<SelectOption>,
  defaultValue: null | string
};

class Select {
  public static from(api: dialog.InteractiveMediaSelect) {
    return new Select(
      getOpt(api.label, ''),
      api.options.map(SelectOption.from),
      getOpt(api.defaultValue, null)
    );
  }

  public static create({ label, options, defaultValue = null }: Props) {
    return new Select(label, options, defaultValue);
  }

  private constructor(
    public readonly label: string,
    public readonly options: Array<SelectOption>,
    public readonly defaultValue: null | string = null
  ) {
  }

  public toApi() {
    return dialog.InteractiveMediaWidget.create({
      interactiveMediaSelect: dialog.InteractiveMediaSelect.create({
        label: google.protobuf.StringValue.create({ value: this.label }),
        options: this.options.map((option) => option.toApi()),
        defaultValue: this.defaultValue ? google.protobuf.StringValue.create({ value: this.defaultValue }) : null
      })
    });
  }
}

export default Select;
