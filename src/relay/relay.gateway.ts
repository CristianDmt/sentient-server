import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { User } from 'src/users/models/user.model';
import { InquiryInterface, IoConnectedClientInterface, IoConnectedClientType } from './interfaces/io-connected-client.interface';
import { RelayService as RelayService } from './relay.service';

const RELAY_MESSAGE = 'relay message';
const RELAY_END_CONVERSATION = 'relay end conversation';
const RELAY_AUTHENTICATION_ERROR = 'authentication error';

const LOG_RELAY_MESSAGE = 'RelayMessage';
const LOG_RELAY_EVENT = 'RelayEvent';

@WebSocketGateway({ namespace: 'relay' })
export class RelayGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() private readonly server: Server
  private connected: { [socketId: string]: IoConnectedClientInterface } = {};
  
  private waitingCustomers: string[] = [];
  private waitingAgents: string[] = [];

  constructor(
    private readonly relayService: RelayService,
    private readonly logger: Logger = new Logger('Relay', true)
  ) { }

  @SubscribeMessage(RELAY_MESSAGE)
  async onMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): Promise<{ ack: boolean }> {
    this.logger.log(`Client {${client.id}} sent '${data}'`, LOG_RELAY_MESSAGE);

    await this.relayService.storeMessage(
      this.getRelayClient(client).conversation,
      this.getRelayClient(client).name, 
      data
    );

    if (this.waitingAgents[0] && this.waitingCustomers[0]) {
      this.connected[this.waitingAgents[0]].to = this.waitingCustomers[0];
      this.connected[this.waitingCustomers[0]].to = this.waitingAgents[0];
    }

    if (this.getRelayClient(client).to) {
      this.server.to(this.getRelayClient(client).to).emit(RELAY_MESSAGE, {
        user: this.getRelayClient(client).name,
        message: data,
        analysis: 0
      });
    }
    
    return { ack: true };
  }

  @SubscribeMessage(RELAY_END_CONVERSATION)
  async onEndConversation(@MessageBody() data: string, @ConnectedSocket() client: Socket): Promise<{ ack: boolean }> {
    if (this.getRelayClient(client).to) {
      this.server.to(this.getRelayClient(client).to)
      delete this.connected[this.getRelayClient(client).to].to;
    }

    client.disconnect();

    return { ack: true }
  }

  afterInit(server: Server) {
    this.logger.log('Initilised...');

    // setInterval(() => {
    //   console.log('Emitting...')
    //   this.server.emit(RELAY_MESSAGE, { user: 'PING', message: 'Ping...' + Date.now(), analysis: 0 });
    // }, 3000);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client {${client.id}} disconnected`, LOG_RELAY_EVENT);
    
    this.removeRelayClient(client);
  }

  async handleConnection(client: Socket, ...args: []) {
    this.logger.log(`Client {${client.id}} connected`, LOG_RELAY_EVENT);
    
    if (client.handshake.query.token) {
      try {
        const decodedToken = this.relayService.decodeRelayToken(client.handshake.query.token);
        const user = await this.relayService.getRelayUser(decodedToken.userId);
        
        this.addRelayClientAgent(client, user);
      } catch (error) {
        client.emit(RELAY_AUTHENTICATION_ERROR, 'Invalid authentication.');
        client.disconnect();
      }
    }
    else if (client.handshake.query.name && client.handshake.query.inquiry) {
      const name = client.handshake.query.name;

      client.emit(RELAY_MESSAGE, { user: -1, message: `Please wait while we connect you with an agent...`});

      this.addRelayClientCustomer(client, client.handshake.query.name, client.handshake.query.inquiry);
    } else {
      client.disconnect();
    }

    console.log('Agents', this.waitingAgents);
    console.log('Customers', this.waitingCustomers);
    console.log(this.connected);
  }
  
  private getRelayClient(client: Socket): IoConnectedClientInterface {
    return this.connected[client.id];
  }

  private addRelayClientAgent(client: Socket, user: User): void {
    this.connected[client.id] = {
      uid: user.id, 
      name: user.name, 
      type: IoConnectedClientType.IO_CLIENT_TYPE_AGENT,
      companyId: user.company[0].id,
      teamIds: user.teams.map(team => team.id)
    };

    this.waitingAgents.push(client.id);
  }

  private addRelayClientCustomer(client: Socket, name: string, inquiry: InquiryInterface): void {
    this.connected[client.id] = {
      name: name, 
      type: IoConnectedClientType.IO_CLIENT_TYPE_CUSTOMER,
      inquiry: inquiry
    };

    this.waitingCustomers.push(client.id);
  }

  private removeRelayClient(client: Socket): void {
    if (this.connected[client.id].type === IoConnectedClientType.IO_CLIENT_TYPE_AGENT) {
      this.waitingAgents.splice(this.waitingAgents.indexOf(client.id), 1);
    } else {
      this.waitingCustomers.splice(this.waitingCustomers.indexOf(client.id), 1);
    }

    delete this.connected[client.id];
  }
}