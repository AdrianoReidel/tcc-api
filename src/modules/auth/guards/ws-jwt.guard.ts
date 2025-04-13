import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>();
    const token = this.extractToken(client);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      const payload = this.jwtService.verify(token);
      client.data.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  private extractToken(client: Socket): string | null {
    const cookie = client.handshake.headers.cookie;
    if (cookie) {
      const parsedCookies = this.parseCookies(cookie);
      return parsedCookies['access_token'] || null;
    }

    return null;
  }

  private parseCookies(cookieHeader: string): Record<string, string> {
    return cookieHeader.split(';').reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = decodeURIComponent(value);
        return acc;
      },
      {} as Record<string, string>,
    );
  }
}
