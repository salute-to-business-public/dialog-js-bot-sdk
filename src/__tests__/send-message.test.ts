/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import dotenv from 'dotenv';
import { combineLatest } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';
import Bot, { User, Peer } from '../index';

let bot1: Bot;
let bot2: Bot;
let bot2Peer: Peer;

beforeAll(async () => {
  dotenv.config();

  const env = (name: string): string => {
    const value = process.env[name];
    if (value) {
      return value;
    }

    throw new Error(`${name} env variable not defined`);
  };

  const endpoints = [env('BOT_ENDPOINT')];
  bot1 = new Bot({ endpoints, token: env('BOT_TOKEN_FIRST') });
  bot2 = new Bot({ endpoints, token: env('BOT_TOKEN_SECOND') });

  const bot2Self = await bot2.getSelf();
  if (!bot2Self.nick) {
    throw new Error('bot2 must have nickname');
  }

  const user = await bot1.findUserByNick(bot2Self.nick);
  if (user) {
    bot2Peer = Peer.private(user.id);
  } else {
    throw new Error('bot1 not able to find bot2');
  }
});

afterAll(() => {
  bot1.stop();
  bot2.stop();
})

test('bot2 should receive message from bot1', () => {
  const text = 'hello, world!';

  return combineLatest(
    bot2.subscribeToMessages(),
    bot1.sendText(bot2Peer, text)
  )
    .pipe(
      filter(([message, mid]) => message.id.toString() === mid.toString()),
      take(1),
      tap(([message]) => {
        if (message.content.type === 'text') {
          expect(message.content.text).toBe(text);
        }
      })
    )
    .toPromise();
});
