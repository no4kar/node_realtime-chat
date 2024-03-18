'use strict';

import { WebSocketServer } from 'ws';

import { server } from './server.js';
import * as messageService from './services/message.service.js';
import * as roomService from './services/room.service.js';
import { MessageAction } from './types/message.type.js';
import { RoomAction } from './types/room.type.js';

const wss = new WebSocketServer({ server });

wss.on('connection', (client, req) => {

  client.customInfo = {};

  client.on('message', (message) => {
    /** @type { import('./types/message.type.js').MessageClient } */
    const data = JSON.parse(message.toString());

    console.dir(data);

    switch (data.action) {
      case RoomAction.ENTER: {
        const { roomId } = data.payload;

        console.info(`
        roomId = ${roomId}
        clientIP = ${req.socket.remoteAddress}
        clientPORT = ${req.socket.remotePort}
        `);

        if (!roomId) {
          return;
        }

        client.customInfo.roomId = roomId;
        roomService.emitter.emit(RoomAction.ENTER, { id: client.customInfo.roomId });

        console.info(`
        client.customInfo.roomId = ${client.customInfo.roomId}
        `);

        return;
      }

      case RoomAction.LEAVE: {
        delete client.customInfo.roomId;
        return;
      }

      default:
        console.info('Unprocessed message');
        break;
    }
  });

  client.on('close', () => {
    roomService.emitter.emit(RoomAction.LEAVE, { id: client.customInfo.roomId });
    delete client.customInfo.roomId;
  });

  console.info(`
  wss.on
  \t'connection'
  `);
});

messageService.emitter.on(MessageAction.CREATE, (message) => {
  console.info(MessageAction.CREATE);
  console.dir(message);

  for (const client of wss.clients) {
    if (client.customInfo.roomId === message.roomId) {
      client.send(JSON.stringify({
        action: MessageAction.CREATE,
        payload: message,
      }));
    }
  }
});

roomService.emitter.on(RoomAction.UPDATE, (rooms) => {
  // console.info(RoomAction.UPDATE);
  // console.dir(rooms);

  for (const client of wss.clients) {
    // console.info(client.readyState);
    client.send(JSON.stringify({
      action: RoomAction.UPDATE,
      payload: rooms,
    }));
  }
});

// setInterval(() => roomService.emitUpdate(), 3000);

console.info(`
messageEmitter.listenerCount
\t${MessageAction.CREATE} = ${messageService.emitter.listenerCount(MessageAction.CREATE)}
roomEmitter.listenerCount
\t${MessageAction.CREATE} = ${roomService.emitter.listenerCount(RoomAction.UPDATE)}
`);
