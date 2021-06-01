import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { IoConnectedClient, IoConnectedClientType } from './interfaces/io-connected-client.interface';
import { RelayService as RelayService } from './relay.service';

const RELAY_MESSAGE = 'relay message';

const LOG_RELAY_MESSAGE = 'RelayMessage';
const LOG_RELAY_EVENT = 'RelayEvent';

@WebSocketGateway({ namespace: 'relay' })
export class RelayGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() private readonly server: Server
  private connected: { [socketId: string]: IoConnectedClient } = {};
  private waitingClients: string[];
  private waitingAgents: string[];

  constructor(
    private readonly relayService: RelayService,
    private readonly logger: Logger = new Logger('Relay', true)
  ) { }

  @SubscribeMessage(RELAY_MESSAGE)
  onMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    this.logger.log(`Client {${client.id}} sent '${data}'`, LOG_RELAY_MESSAGE);
    // console.log(client.handshake);
    this.server.to(Object.keys(this.connected)[0]).emit(RELAY_MESSAGE, { user: this.getRelayClient(client).name, message: data });
    setInterval(() => {
      this.server.to(client.id).emit(RELAY_MESSAGE, { user: "BOT", message: "Test Focus Mode "});
    }, 5000);
    return data;
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client {${client.id}} disconnected`, LOG_RELAY_EVENT);
    // client.leave(Object.keys(this.connected)[0]);
    delete this.connected[client.id];
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client {${client.id}} connected`, LOG_RELAY_EVENT);

    // if (Object.keys(this.connected)[0]) {
    //   client.join(Object.keys(this.connected)[0]);
    //   this.logger.log(`Joined {${client.id}} to {${Object.keys(this.connected)[0]}}`, LOG_RELAY_EVENT);
    // }

    this.addRelayClient(client, IoConnectedClientType.IO_CLIENT_TYPE_CUSTOMER);

    // console.log(this.server.adapter.rooms[Object.keys(this.connected)[0]]);
    console.log(this.server.adapter.rooms); 
  }
  
  private getRelayClient(client: Socket): IoConnectedClient {
    return this.connected[client.id];
  }

  private addRelayClient(client: Socket, type: IoConnectedClientType): void {
    this.connected[client.id] = { 
      name: `Customer #${Object.keys(this.connected).length+1}`, 
      type: type 
    };
  }
}