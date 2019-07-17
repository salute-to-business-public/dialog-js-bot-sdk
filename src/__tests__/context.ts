/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import dotenv from 'dotenv';
import Bot, { Peer } from '../index';
import { beforeAllWithContext, afterAllWithContext } from './test-utils';

const context = beforeAllWithContext(async () => {
  dotenv.config();

  const env = (name: string): string => {
    const value = process.env[name];
    if (value) {
      return value;
    }

    throw new Error(`${name} env variable not defined`);
  };

  const endpoints = [env('BOT_ENDPOINT')];
  const bot1 = new Bot({ endpoints, token: env('BOT_TOKEN_FIRST') });
  const bot2 = new Bot({ endpoints, token: env('BOT_TOKEN_SECOND') });

  const bot2Self = await bot2.getSelf();
  if (!bot2Self.nick) {
    throw new Error('bot2 must have nickname');
  }

  const bot2Peer = await bot1
    .findUserByNick(bot2Self.nick)
    .then((user) => {
      if (user) {
        return Peer.private(user.id);
      }

      throw new Error('bot1 not able to find bot2');
    });

  return { bot1, bot2, bot2Peer };
});

afterAllWithContext(context, async ({ bot1, bot2 }) => {
  bot1.stop();
  bot2.stop();
});

export default context;
