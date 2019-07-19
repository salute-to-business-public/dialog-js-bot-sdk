/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import UUID from './UUID';

class ActionEvent {
  public static from(api: dialog.UpdateInteractiveMediaEvent) {
    return new ActionEvent(
      api.id,
      api.value,
      api.uid,
      api.mid ? UUID.from(api.mid) : null,
    );
  }

  private constructor(
    public readonly id: string,
    public readonly value: string,
    public readonly uid: number,
    public readonly mid: null | UUID,
  ) {}
}

export default ActionEvent;
