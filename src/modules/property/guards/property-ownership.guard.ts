import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PropertyOwnershipGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // { sub: string, role: string[] }
    const propertyId = request.params.id || request.params.propertyId;

    // Se não tiver propertyId na rota, não tem o que checar.
    if (!propertyId) {
      return true;
    }

    // Se for admin, passa
    if (user.role.includes('ADMIN')) {
      return true;
    }

    // Caso contrário, buscamos a propriedade
    const prop = await this.prisma.property.findUnique({
      where: { id: propertyId },
      select: { hostId: true },
    });

    if (!prop) {
      // Decisão: você pode lançar exceção aqui, ou deixar que
      // o Service lance NotFoundException.
      // Vou lançar ForbiddenException pra ilustrar.
      throw new ForbiddenException('Propriedade não encontrada.');
    }

    // Se a propriedade não pertence ao usuário, nega
    if (prop.hostId !== user.sub) {
      throw new ForbiddenException('Você não é o host desta propriedade.');
    }

    return true;
  }
}
