/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { dialog } from '@dlghq/dialog-api';
import Rpc from './Rpc';
import { User, Group, Message } from './entities';
import State from './State';
import { ResponseEntities } from './internal/types';
import { filter, multicast, retry } from 'rxjs/operators';
import { Subject } from 'rxjs';

type Config = {
  token: string,
  endpoints: Array<string>
};

class Bot {
  private readonly rpc: Rpc;
  private readonly ready: Promise<void>;
  public readonly updateSubject: Subject<dialog.UpdateSeqUpdate> = new Subject();

  constructor(config: Config) {
    const endpoint = config.endpoints.map((url) => new URL(url)).find(() => true);
    if (!endpoint) {
      throw new Error('Endpoints misconfigured');
    }

    this.rpc = new Rpc(endpoint);
    this.ready = this.start(config.token);
  }

  private async start(token: string) {
    const self = User.from(await this.rpc.authorize(token));
    const state = new State(self);
    const dialogs = await this.applyEntities(state, await this.rpc.loadDialogs());
    state.applyDialogs(dialogs);

    console.log('subscribe seq updates');

    this.rpc.subscribeSeqUpdates().pipe(retry()).subscribe(this.updateSubject);
  }

  private async applyEntities<T>(state: State, responseEntities: ResponseEntities<T>): Promise<T> {
    const peerEntities = state.applyResponseEntities(responseEntities);
    const entities = await this.rpc.loadPeerEntities(peerEntities);
    state.applyEntities(entities);

    return responseEntities.payload;
  }

  public onMessage(callback: (message: Message) => void) {
    return this.updateSubject.subscribe(({ updateMessage }) => {
      if (!updateMessage) {
        return;
      }

      callback(Message.from(updateMessage));
    });
  }
}

export default Bot;
