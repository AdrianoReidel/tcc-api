import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthInterface } from './auth.interface';
import { LoginResponseDto } from './dtos/login-response.dto';
import { UserAuthDto } from '../user/dtos/user-auth.dto';
import * as bcrypt from 'bcryptjs';
import { validateCpf } from 'utils/cpf.utils';
import { formatCpf } from 'utils/cpf.utils';

@Injectable()
export class AuthService implements AuthInterface {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(user: UserAuthDto): Promise<LoginResponseDto> {
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async refresh(refreshToken: string): Promise<string> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const access_token = {
        email: payload.email,
        sub: payload.sub,
      };
      return this.jwtService.sign(access_token, { expiresIn: '60m' });
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido.');
    }
  }

  async validateUser(email: string, password: string): Promise<UserAuthDto> {
    const user = await this.prisma.app_user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) return null;
    delete user.password;

    const userAuthDto: UserAuthDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return userAuthDto;
  }

  async findUserByEmail(email: string): Promise<{ status: string } | null> {
    const user = await this.prisma.app_user.findUnique({
      where: { email },
      select: { status: true },
    });
    return user;
  }

  async register(user: CreateUserDto): Promise<void> {
    let cpfFormated: string | undefined;

    if (user.cpf) {
      if (!(await validateCpf(user.cpf))) {
        throw new BadRequestException('CPF inválido');
      }
      cpfFormated = formatCpf(user.cpf);
      await this.verifyCpfExists(cpfFormated);
    }

    await this.verifyEmailExists(user.email);

    const hashedPassword = await bcrypt.hash(user.password, 8);

    await this.prisma.app_user.create({
      data: {
        ...user,
        ...(cpfFormated && { cpf: cpfFormated }),
        password: hashedPassword,
      },
    });
  }

  async registerWithoutPassword(user: CreateUserDto): Promise<void> {
    await this.prisma.app_user.create({
      data: user,
    });
  }

  async check(access_token: string): Promise<boolean> {
    try {
      this.jwtService.verify(access_token);
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private async verifyEmailExists(email: string): Promise<void> {
    const user = await this.prisma.app_user.findUnique({ where: { email } });
    if (user) throw new ConflictException('Email já está em uso.');
  }

  private async verifyCpfExists(cpf: string): Promise<void> {
    const user = await this.prisma.app_user.findUnique({ where: { cpf } });
    if (user) throw new ConflictException('CPF já está em uso.');
  }
}
