/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import fs from 'fs';
import _ from 'lodash';
import Bluebird from 'bluebird';
import { Metadata } from 'grpc';
import { dialog, google } from '@dlghq/dialog-api';
import createCredentials from './utils/createCredentials';
import Services from './services';
import mapNotNull from './utils/mapNotNull';
import reduce from './utils/reduce';
import { Entities, PeerEntities, ResponseEntities } from './internal/types';
import { Observable, from } from 'rxjs';
import { flatMap, last, map } from 'rxjs/operators';
import { Content, OutPeer, FileLocation } from './entities';
import MessageAttachment from './entities/messaging/MessageAttachment';
import { contentToApi, DocumentContent } from './entities/messaging/content';
import { FileInfo } from './utils/getFileInfo';
import randomLong from './utils/randomLong';
import fromReadStream from './utils/fromReadStream';
import UUID from './entities/UUID';

const pkg = require('../package.json');

class Rpc extends Services {
  private metadata: null | Promise<Metadata> = null;

  constructor(endpoint: URL) {
    super(endpoint, createCredentials(endpoint));
  }

  async getMetadata() {
    if (!this.metadata) {
      this.metadata = this.registration.registerDevice(
        dialog.RequestRegisterDevice.create({
          appId: 1,
          appTitle: 'bot',
          clientPk: Buffer.alloc(32),
          deviceTitle: `dialog-bot-sdk/v${pkg.version} node/${process.version}`
        })
      )
        .then((res) => {
          const metadata = new Metadata();
          metadata.set('x-auth-ticket', res.token);

          return metadata;
        });
    }

    return this.metadata;
  }

  async authorize(token: string) {
    const res = await this.authentication.startTokenAuth(
      dialog.RequestStartTokenAuth.create({
        token,
        appId: 1,
        timeZone: google.protobuf.StringValue.create({ value: 'UTC' }),
        preferredLanguages: ['en']
      }),
      await this.getMetadata()
    );

    if (!res.user) {
      throw new Error('Unexpected behaviour');
    }

    return res.user;
  }

  async loadMissingPeers(peers: Array<dialog.Peer>): Promise<ResponseEntities<dialog.Dialog[]>> {
    const { dialogs: payload, users, groups, userPeers, groupPeers } = await this.messaging.loadDialogs(
      dialog.RequestLoadDialogs.create({ peersToLoad: peers }),
      await this.getMetadata()
    );

    return { payload, users, groups, userPeers, groupPeers };
  }

  async loadDialogs(): Promise<ResponseEntities<dialog.Dialog[]>> {
    const { dialogIndices } = await this.messaging.fetchDialogIndex(
      dialog.RequestFetchDialogIndex.create(),
      await this.getMetadata()
    );

    const peers = mapNotNull(dialogIndices, (index) => index.peer);

    const responses = await Bluebird.mapSeries(_.chunk(peers, 10), async (peersToLoad) => {
      return this.messaging.loadDialogs(
        dialog.RequestLoadDialogs.create({ peersToLoad }),
        await this.getMetadata()
      );
    });

    const entities = reduce(
      responses,
      new dialog.ResponseLoadDialogs(),
      (entities, res) => {
        entities.users.push(...res.users);
        entities.groups.push(...res.groups);
        entities.dialogs.push(...res.dialogs);
        entities.userPeers.push(...res.userPeers);
        entities.groupPeers.push(...res.groupPeers);

        return entities;
      }
    );

    return {
      payload: entities.dialogs,
      users: entities.users,
      groups: entities.groups,
      userPeers: entities.userPeers,
      groupPeers: entities.groupPeers
    };
  }

  async loadPeerEntities(entities: PeerEntities): Promise<Entities> {
    return this.sequenceAndUpdates.getReferencedEntities(
      dialog.RequestGetReferencedEntitites.create(entities),
      await this.getMetadata()
    );
  }

  private async getInitialState() {
    const metadata = await this.getMetadata();
    const { seq, state } = await this.sequenceAndUpdates.getState(
      dialog.RequestGetState.create(),
      metadata
    );

    return { metadata, seq, state };
  }

  // private async getDifference(seq: number, state: Uint8Array, metadata: Metadata) {
  //   const diff = await this.sequenceAndUpdates.getDifference(
  //     dialog.RequestGetDifference.create({ seq, state }),
  //     metadata
  //   );
  //
  //
  // }
  //
  // subscribeSeqUpdates(): Observable<dialog.UpdateSeqUpdate> {
  //   return from(this.getInitialState())
  //     .pipe(flatMap(({ metadata, seq, state }) => {
  //       let prevSeq = seq;
  //
  //       return Observable.create((emitter: Subscriber<dialog.UpdateSeqUpdate>) => {
  //         this.sequenceAndUpdates.seqUpdates(google.protobuf.Empty.create(), metadata)
  //           .subscribe(
  //             (updateBox) => {
  //               if (updateBox.seq === prevSeq + 1 && updateBox.unboxedUpdate) {
  //                 prevSeq = updateBox.seq;
  //                 emitter.next(updateBox.unboxedUpdate);
  //               } else {
  //               }
  //             },
  //             (error) => {
  //             },
  //             () => {
  //             }
  //           );
  //
  //       });
  //     }))
  //
  // }

  subscribeSeqUpdates(): Observable<dialog.UpdateSeqUpdate> {
    return from(this.getInitialState())
      .pipe(flatMap(({ metadata }) => this.sequenceAndUpdates.seqUpdates(
        google.protobuf.Empty.create(),
        metadata
      )))
      .pipe(map(({ unboxedUpdate }) => {
        if (unboxedUpdate) {
          return unboxedUpdate;
        }

        throw new Error('Unexpected behaviour');
      }));
  }

  async sendMessage(
    peer: OutPeer,
    content: Content,
    attachment?: null | MessageAttachment,
    isOnlyForUser?: null | number
  ) {
    const rid = await randomLong();

    const res = await this.messaging.sendMessage(
      dialog.RequestSendMessage.create({
        rid,
        isOnlyForUser,
        peer: peer.toApi(),
        message: contentToApi(content),
        reply: attachment ? attachment.toReplyApi() : null,
        forward: attachment ? attachment.toForwardApi() : null
      }),
      await this.getMetadata()
    );

    if (!res.mid) {
      throw new Error('Unexpected behaviour');
    }

    return UUID.from(res.mid);
  }

  async editMessage(mid: UUID, content: Content) {
    await this.messaging.updateMessage(
      dialog.RequestUpdateMessage.create({
        mid: mid.toApi(),
        updatedMessage: contentToApi(content)
      }),
      await this.getMetadata()
    );
  }

  async uploadFile(fileName: string, fileInfo: FileInfo, maxChunkSize: number = 1024 * 1024) {
    const metadata = await this.getMetadata();
    const { uploadKey } = await this.mediaAndFiles.getFileUploadUrl(
      dialog.RequestGetFileUploadUrl.create({ expectedSize: fileInfo.size }),
      metadata
    );

    let partNumber = 0;
    const location = await fromReadStream(
      fs.createReadStream(fileName, { highWaterMark: maxChunkSize })
    )
      .pipe(flatMap(async (chunk) => {
        const { url } = await this.mediaAndFiles.getFileUploadPartUrl(
          dialog.RequestGetFileUploadPartUrl.create({
            uploadKey,
            partSize: chunk.length,
            partNumber: partNumber++
          }),
          metadata
        );

        await this.mediaAndFiles.uploadChunk(url, chunk);
      }))
      .pipe(last())
      .pipe(flatMap(async () => {
        const { uploadedFileLocation } = await this.mediaAndFiles.commitFileUpload(
          dialog.RequestCommitFileUpload.create({ uploadKey, fileName: fileInfo.name }),
          metadata
        );

        if (!uploadedFileLocation) {
          throw new Error('File unexpectedly failed');
        }

        return uploadedFileLocation;
      }))
      .toPromise();

    return location;
  }
}

export default Rpc;
