/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { combineLatest } from 'rxjs';
import { tap, filter, first } from 'rxjs/operators';
import { testWithContext } from './test-utils';
import context from './context';

testWithContext(
  'bot2 should receive message from bot1',
  context,
  async ({ bot1, bot2, bot2Peer }) => {
    const text = `test message ${new Date()}`;

    await combineLatest(
      bot2.subscribeToMessages(),
      bot1.sendText(bot2Peer, text),
    )
      .pipe(
        filter(([receivedMessage, sentMessage]) =>
          receivedMessage.id.equals(sentMessage.id),
        ),
        first(),
        tap(([receivedMessage, sentMessage]) => {
          expect(receivedMessage.content.type).toBe(sentMessage.content.type);
          if (receivedMessage.content.type === 'text') {
            expect(receivedMessage.content.text).toBe(text);
          }
        }),
      )
      .toPromise();
  },
);
