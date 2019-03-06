/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */


import path from 'path';
import dotenv from 'dotenv';
import Bot, { MessageAttachment, ActionGroup, Action, Button } from '../src';
import { flatMap } from 'rxjs/operators';
import { combineLatest, merge } from 'rxjs';

dotenv.config();

async function run(token: string, endpoint: string) {
  const bot = new Bot({
    token,
    endpoints: [endpoint]
  });

  const self = await bot.getSelf();
  console.log(`I've started, post me something @${self.nick}`);

  bot.updateSubject.subscribe({
    next(update) {
      console.log(JSON.stringify({ update }, null, 2));
    }
  });

  const messagesHandle = bot
    .subscribeToMessages()
    .pipe(flatMap(async (message) => {
      if (message.content.type === 'text') {
        switch (message.content.text) {
          case 'octocat':
            await bot.sendImage(
              message.peer,
              path.join(__dirname, 'Sentrytocat.jpg'),
              MessageAttachment.forward(message.id)
            );
            break;

          case 'document':
            // reply to self sent message with document
            await bot.sendDocument(message.peer, __filename, MessageAttachment.reply(message.id));
            break;

          case 'delete':
            if (message.attachment) {
              await Promise.all(message.attachment.mids.map((mid) => bot.deleteMessage(mid)));
            }
            break;

          default:
            // echo message with reply
            const mid = await bot.sendText(
              message.peer,
              message.content.text,
              MessageAttachment.reply(message.id),
              ActionGroup.create({
                actions: [
                  Action.create({
                    id: 'test',
                    widget: Button.create({ label: 'Test' })
                  })
                ]
              })
            );
            break;
        }
      }
    }));

  const actionsHandle = bot
    .subscribeToActions()
    .pipe(flatMap(async (event) => console.log(JSON.stringify(event, null, 2))));

  await new Promise((resolve, reject) => {
    merge(messagesHandle, actionsHandle)
      .subscribe({
        error: reject,
        complete: resolve
      });
  });
}


const token = process.env.BOT_TOKEN;
if (typeof token !== 'string') {
  throw new Error('BOT_TOKEN env variable not configured');
}

const endpoint = process.env.BOT_ENDPOINT || 'https://grpc-test.transmit.im:9443';

run(token, endpoint)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });