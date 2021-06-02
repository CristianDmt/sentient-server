import { IoAdapter } from '@nestjs/platform-socket.io';
import *  as redisIoAdapter from 'socket.io-redis';
import { Server } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number): Server {
    const server = super.createIOServer(port);
    const redisAdapter = redisIoAdapter(
      { host: 'localhost', port: 6379 },
      { key: 'relay' }
    );

    server.adapter(redisAdapter);
    server.use((socket, next) => {
      console.log('Middleware...');
      return next();
    });

    return server;
  }
}