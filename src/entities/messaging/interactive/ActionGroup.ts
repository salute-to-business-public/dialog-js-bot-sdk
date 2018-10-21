/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog, google } from '@dlghq/dialog-api';
import { Widget, apiToWidget } from './widgets';
import { getOpt } from '../../utils';
import { ActionStyle, apiToActionStyle, actionStyleToApi } from './ActionStyle';
import ActionConfirm from './ActionConfirm';
import Action from './Action';

type Props = {
  actions: Array<Action>,
  title?: null | string,
  description?: null | string,
  translations?: null | Translations
};

type Translations = {
  [locale: string]: {
    [key: string]: string
  }
};

class ActionGroup {
  public static from(api: dialog.InteractiveMediaGroup) {
    const actions: Array<Action> = [];
    api.actions.forEach((apiAction) => {
      const action = Action.from(apiAction);
      if (action) {
        actions.push(action);
      }
    });

    const translations: Translations = {};
    api.translations.forEach((group) => {
      const messages: { [key: string]: string } = {};
      group.messages.forEach(({ id, value }) => {
        messages[id] = value;
      });

      translations[group.language] = messages;
    });

    return new ActionGroup(
      actions,
      getOpt(api.title, null),
      getOpt(api.description, null),
      translations
    );
  }

  public static create({ actions, title, description, translations }: Props) {
    return new ActionGroup(
      actions,
      title || null,
      description || null,
      translations || {}
    );
  }

  private constructor(
    public readonly actions: Array<Action>,
    public readonly title: null | string,
    public readonly description: null | string,
    public readonly translations: Translations
  ) {
  }

  public toApi() {
    return dialog.InteractiveMediaGroup.create({
      actions: this.actions.map((action) => action.toApi()),
      title: this.title ? google.protobuf.StringValue.create({ value: this.title }) : null,
      description: this.description ? google.protobuf.StringValue.create({ value: this.description }) : null,
      translations: Object.keys(this.translations).map((language) => {
        const messages: { [key: string]: string } = this.translations[language];

        return dialog.InteractiveMediaTranslationGroup.create({
          language,
          messages: Object.keys(messages)
            .map((id) => dialog.InteractiveMediaTranslation.create({ id, value: messages[id] }))
        })
      })
    });
  }
}

export default ActionGroup;
