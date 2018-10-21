/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */


import { dialog } from '@dlghq/dialog-api';
import Button from './Button';
import Select from './Select';
import SelectOption from './SelectOption';

export type Widget = Button | Select;

export {
  Button,
  Select,
  SelectOption
};

/**
 * @private
 */
export function apiToWidget(api: dialog.InteractiveMediaWidget): null | Widget {
  if (api.interactiveMediaButton) {
    return Button.from(api.interactiveMediaButton);
  }

  if (api.interactiveMediaSelect) {
    return Select.from(api.interactiveMediaSelect);
  }

  return null;
}
