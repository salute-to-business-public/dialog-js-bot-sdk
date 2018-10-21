/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';

export enum ActionStyle {
  DANGER = 'danger',
  PRIMARY = 'primary',
  DEFAULT = 'default'
}

/**
 * @private
 */
export function apiToActionStyle(api: dialog.InteractiveMediaStyle): ActionStyle {
  switch (api) {
    case dialog.InteractiveMediaStyle.INTERACTIVEMEDIASTYLE_DANGER:
      return ActionStyle.DANGER;

    case dialog.InteractiveMediaStyle.INTERACTIVEMEDIASTYLE_PRIMARY:
      return ActionStyle.PRIMARY;

    default:
      return ActionStyle.DEFAULT;
  }
}

/**
 * @private
 */
export function actionStyleToApi(style: ActionStyle): dialog.InteractiveMediaStyle {
  switch (style) {
    case ActionStyle.DANGER:
      return dialog.InteractiveMediaStyle.INTERACTIVEMEDIASTYLE_DANGER;

    case ActionStyle.PRIMARY:
      return dialog.InteractiveMediaStyle.INTERACTIVEMEDIASTYLE_PRIMARY;

    default:
      return dialog.InteractiveMediaStyle.INTERACTIVEMEDIASTYLE_DEFAULT;
  }
}
