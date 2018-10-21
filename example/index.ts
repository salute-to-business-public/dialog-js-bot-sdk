/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */


import path from 'path';
import dotenv from 'dotenv';
import Bot, { MessageAttachment } from '../src';

dotenv.config();

const token = process.env.BOT_TOKEN;
if (typeof token !== 'string') {
  throw new Error('BOT_TOKEN env variable not configured');
}

const bot = new Bot({
  token,
  endpoints: ['https://grpc-test.transmit.im:9443']
});

bot.updateSubject.subscribe({
  next(update) {
    console.log('update', update);
  }
});

bot
  .onMessage(async (message) => {
    if (message.content.type === 'text') {
      // echo message with reply
      const mid = await bot.sendText(
        message.peer,
        message.content.text,
        MessageAttachment.reply(message.id)
      );

      if (message.content.text === 'octocat') {
        await bot.sendImage(message.peer, path.join(__dirname, 'Sentrytocat.jpg'));
      } else {
        // reply to self sent message with document
        await bot.sendDocument(message.peer, __filename, MessageAttachment.reply(mid));
      }
    }
  })
  .toPromise()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
