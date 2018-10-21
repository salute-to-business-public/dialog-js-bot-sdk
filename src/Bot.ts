/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */


import _ from 'lodash';
import { Observable, Subject, EMPTY } from 'rxjs';
import { flatMap, retry } from 'rxjs/operators';
import { dialog } from '@dlghq/dialog-api';
import Rpc from './Rpc';
import {
  UUID,
  Peer,
  User,
  Group,
  FileLocation,
  Message,
  TextContent,
  DocumentContent,
  MessageAttachment
} from './entities';
import State from './State';
import { ResponseEntities } from './internal/types';
import getFileInfo from './utils/getFileInfo';

type Config = {
  token: string,
  endpoints: Array<string>
};

class Bot {
  private readonly rpc: Rpc;
  private readonly ready: Promise<State>;
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

    this.rpc.subscribeSeqUpdates().pipe(retry()).subscribe(this.updateSubject);

    return state;
  }

  private async applyEntities<T>(state: State, responseEntities: ResponseEntities<T>): Promise<T> {
    const peerEntities = state.applyResponseEntities(responseEntities);
    const entities = await this.rpc.loadPeerEntities(peerEntities);
    state.applyEntities(entities);

    return responseEntities.payload;
  }

  /**
   * Subscribes to messages stream.
   */
  public onMessage(callback: (message: Message) => Promise<void>): Observable<void> {
    return this.updateSubject
      .pipe(flatMap((update) => {
        if (update.updateMessage) {
          return callback(Message.from(update.updateMessage));
        }

        return EMPTY;
      }));
  }

  /**
   * Sends text message.
   */
  public async sendText(peer: Peer, text: string, attachment?: MessageAttachment): Promise<UUID> {
    const state = await this.ready;
    const outPeer = state.createOutPeer(peer);

    const content = TextContent.create(text, []);

    return this.rpc.sendMessage(outPeer, content, attachment);
  }

  /**
   * Sends document message.
   */
  public async sendDocument(
    peer: Peer,
    fileName: string,
    attachment?: MessageAttachment
  ): Promise<UUID> {
    const state = await this.ready;
    const outPeer = state.createOutPeer(peer);
    const fileInfo = await getFileInfo(fileName);
    const fileLocation = await this.rpc.uploadFile(fileName, fileInfo);

    const content = DocumentContent.create(
      fileInfo.name,
      fileInfo.size,
      fileInfo.mime,
      null,
      FileLocation.from(fileLocation),
      null
    );

    return this.rpc.sendMessage(outPeer, content, attachment);
  }
}

export default Bot;
