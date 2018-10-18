/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import _ from 'lodash';
import Bluebird from 'bluebird';
import { Metadata } from 'grpc';
import { dialog, google } from '@dlghq/dialog-api';
import createCredentials from './utils/createCredentials';
import Services from './services';
import mapNotNull from './utils/mapNotNull';
import reduce from './utils/reduce';
import { Entities, PeerEntities, ResponseEntities } from './internal/types';
import { Observable, Subscriber, from } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';

const pkg = require('../package.json');

class Rpc extends Services {
  metadata: null | Promise<Metadata> = null;

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
}

export default Rpc;
