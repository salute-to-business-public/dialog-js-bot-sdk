# Dialog JS Bot SDK

Bot SDK for [Dialog](https://dlg.im) messenger.

[![CircleCI](https://img.shields.io/circleci/project/github/dialogs/js-bot-sdk/master.svg)](https://circleci.com/gh/dialogs/js-bot-sdk/tree/master)
[![codecov](https://codecov.io/gh/dialogs/js-bot-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/dialogs/js-bot-sdk)

## Installation

```
npm install @dlghq/dialog-bot-sdk
```

## Usage

```typescript
import dotenv from 'dotenv';
import Bot, { MessageAttachment } from '@dlghq/dialog-bot-sdk';

dotenv.config();

const token = process.env.BOT_TOKEN;
if (typeof token !== 'string') {
  throw new Error('BOT_TOKEN env variable not configured');
}

const bot = new Bot({
  token,
  endpoints: ['https://epm.dlg.im'],
});

bot.updateSubject.subscribe({
  next(update) {
    console.log('update', update);
  },
});

bot
  .onMessage(async (message) => {
    if (message.content.type === 'text') {
      // echo message with reply
      const mid = await bot.sendText(
        message.peer,
        message.content.text,
        MessageAttachment.reply(message.id),
      );

      // reply to self sent message with document
      await bot.sendDocument(
        message.peer,
        __filename,
        MessageAttachment.reply(mid),
      );
    }
  })
  .subscribe({
    error(error) {
      console.error(error);
      process.exit(1);
    },
  });
```

## Mutual authentication

In case your server requires mutual authentication, you can pass credentials like this.

```typescript
import fs from 'fs';
import Bot from '@dlghq/dialog-bot-sdk';

const bot = new Bot({
  token,
  endpoints: ['https://epm.dlg.im'],
  ssl: {
    rootCerts: fs.readFileSync(path.join(__dirname, 'dialog-root-cert.crt')),
    privateKey: fs.readFileSync(path.join(__dirname, 'client.key')),
    certChain: fs.readFileSync(path.join(__dirname, 'client.crt')),
  },
});
```

## License

[Apache 2.0](LICENSE)
