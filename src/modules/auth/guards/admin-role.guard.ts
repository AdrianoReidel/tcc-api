import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    const user = await this.prisma.app_user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    if (!user.role.includes('ADMIN')) {
      throw new UnauthorizedException('Usuário não autorizado.');
    }

    return true;
  }
}
