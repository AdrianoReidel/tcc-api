import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthInterface } from '../auth.interface';
import { UserAuthDto } from '../../user/dtos/user-auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthInterface) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string): Promise<UserAuthDto> {
    const user = await this.authService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }
    if (user.status === 'INACTIVE') {
      throw new UnauthorizedException('Usuário inativo.');
    }
    const validatedUser = await this.authService.validateUser(email, password);
    if (!validatedUser) {
      throw new UnauthorizedException('Senha inválida.');
    }

    return validatedUser;
  }
}
