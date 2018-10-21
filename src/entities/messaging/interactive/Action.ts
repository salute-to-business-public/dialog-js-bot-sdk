/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog, google } from '@dlghq/dialog-api';
import { Widget, apiToWidget } from './widgets';
import { ActionStyle, apiToActionStyle, actionStyleToApi } from './ActionStyle';
import ActionConfirm from './ActionConfirm';

type Props = {
  id: string,
  widget: Widget,
  style?: null | ActionStyle,
  confirm?: null | ActionConfirm
};

class Action {
  public static from(api: dialog.InteractiveMedia) {
    const widget = api.widget ? apiToWidget(api.widget) : null;
    if (!widget) {
      return null;
    }

    return new Action(
      api.id,
      widget,
      apiToActionStyle(api.style),
      api.confirm ? ActionConfirm.from(api.confirm) : null
    );
  }

  public static create({ id, widget, style, confirm }: Props) {
    return new Action(id, widget, style || ActionStyle.DEFAULT, confirm || null);
  }

  private constructor(
    public readonly id: string,
    public readonly widget: Widget,
    public readonly style: ActionStyle,
    public readonly confirm: null | ActionConfirm
  ) {
  }

  public toApi() {
    return dialog.InteractiveMedia.create({
      id: this.id,
      widget: this.widget.toApi(),
      style: actionStyleToApi(this.style),
      confirm: this.confirm ? this.confirm.toApi() : null
    });
  }
}

export default Action;
