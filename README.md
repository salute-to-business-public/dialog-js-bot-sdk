# Dialog JS Bot SDK

Bot SDK for [Dialog](https://dlg.im) messenger.

## Installation

```
npm install @dlghq/dialog-bot-sdk
```

## Example

An example of an implementation can be found on the path — `./example/index.ts`

## Configure

`token`: A token of an existing bot is needed

`endpoint`: A url to grpc is required

## Create Bot

Text the Security Bot in Dialog

```
/bot new <nickname> <name>
```

## Usage

```typescript
import dotenv from 'dotenv';
import Bot from '@dlghq/dialog-bot-sdk';
import { flatMap } from 'rxjs/operators';

dotenv.config();

async function run(token: string, endpoint: string) {
  const bot = new Bot({
    token,
    endpoints: [endpoint],
    loggerOptions: {
      name: 'example-bot',
      level: 'trace',
      prettyPrint: true,
    },
  });

  const self = await bot.getSelf();
  bot.logger.info(`I've started, post me something @${self.nick}`);

  bot.updateSubject.subscribe({
    next(update) {
      bot.logger.info(JSON.stringify({ update }, null, 2));
    },
  });

  const messagesHandle = bot.subscribeToMessages().pipe(
    flatMap(async (message) => {
      const author = await bot.forceGetUser(message.senderUserId);
      if (author.isBot) {
        await bot.sendText(message.peer, "Hi, I'm bot too!");
        return;
      }
    }),
  );

  await new Promise((resolve, reject) => {
    messagesHandle.subscribe({
      error: reject,
      complete: resolve,
    });
  });
}

const token = process.env.BOT_TOKEN;
if (typeof token !== 'string') {
  throw new Error('BOT_TOKEN env variable not configured');
}

const endpoint =
  process.env.BOT_ENDPOINT || 'https://grpc-test.transmit.im:9443';

run(token, endpoint).catch((error) => {
  console.error(error);
  process.exit(1);
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
