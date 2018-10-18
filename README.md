Dialog JS Bot SDK
=================

Bot SDK for [Dialog](https://dlg.im) messenger.

**Work in progress**


Installation
------------

```
npm install @dlghq/dialog-bot-sdk
```

Usage
-----

```typescript
import dotenv from 'dotenv';
import Bot from '@dlghq/dialog-bot-sdk';

dotenv.config();

const token = process.env.BOT_TOKEN;
if (typeof token !== 'string') {
  throw new Error('BOT_TOKEN env variable not configured');
}

const bot = new Bot({
  token,
  endpoints: ['https://grpc-test.transmit.im:9443']
});

// subscribe for messages
bot.onMessage((message) => {
  console.log(JSON.stringify(message));
});

// raw updates
bot.updateSubject.subscribe({
  next(update) {
    console.log('update', update);
  }
});
```

License
-------
[Apache 2.0](LICENSE)

