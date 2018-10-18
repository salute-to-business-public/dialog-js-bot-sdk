/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */


import dotenv from 'dotenv';
import Bot from '../src';

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


bot.onMessage((message) => {
  console.log(JSON.stringify(message));
});
