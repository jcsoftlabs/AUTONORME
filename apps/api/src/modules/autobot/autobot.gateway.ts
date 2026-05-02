import {
  WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AutobotService } from './autobot.service';
import type { ChatMessage } from './autobot.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

interface ChatPayload {
  message: string;
  history?: ChatMessage[];
}

@WebSocketGateway({ namespace: '/autobot', cors: { origin: '*', credentials: true } })
export class AutobotGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(AutobotGateway.name);

  constructor(
    private readonly autobotService: AutobotService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    try {
      const token = client.handshake.auth['token'] as string | undefined
        ?? (client.handshake.headers['authorization'] as string | undefined)?.replace('Bearer ', '');

      if (token) {
        const payload = this.jwtService.verify<{ sub: string }>(token, {
          secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        });
        client.userId = payload.sub;
      } else {
        client.userId = `anon_${client.id}`;
      }
      this.logger.log(`AutoBot WS connected: ${client.userId}`);
    } catch {
      client.userId = `anon_${client.id}`;
    }
  }

  handleDisconnect(client: AuthenticatedSocket): void {
    this.logger.log(`AutoBot WS disconnected: ${client.userId}`);
  }

  @SubscribeMessage('chat')
  async handleChat(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: ChatPayload,
  ): Promise<void> {
    const userId = client.userId ?? 'anonymous';
    try {
      client.emit('thinking', { status: true });
      const reply = await this.autobotService.chat(userId, 'WEB', payload.message, payload.history ?? []);
      client.emit('reply', { message: reply });
    } catch (err) {
      this.logger.error('AutoBot chat error', err);
      client.emit('error', { message: 'AutoBot temporairement indisponible' });
    } finally {
      client.emit('thinking', { status: false });
    }
  }
}
