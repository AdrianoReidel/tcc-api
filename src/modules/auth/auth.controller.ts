import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Res,
  Req,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthInterface } from './auth.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SuccessResponse } from 'src/decorators/success-response.decorator';
import { LoginUserDto } from './dtos/login-user.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AcceptInviteDto } from './dtos/accept-invite.dto';
import { user_role } from '@prisma/client';

@ApiTags('Auth')
@ApiBearerAuth('JWT-auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthInterface
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login de usuário' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 201,
    description: 'Login realizado com sucesso.',
    type: LoginResponseDto,
  })
  async login(@Request() req: any, @Res() res: any): Promise<LoginResponseDto> {
    console.log('Login:', req.user);

    const tokens = await this.authService.login(req.user);

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1 * 60 * 60 * 1000, // 1 hora
      path: '/',
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      path: '/',
    });

    return res.status(200).send(tokens);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout do usuário' })
  async logout(@Res() res: any) {
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    };
    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);
    return res.send('Logout realizado com sucesso!');
  }

  @Post('register')
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado.',
    type: String,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Email ou CPF já estão em uso.',
  })
  @ApiResponse({
    status: 400,
    description: 'CPF inválido',
  })
  @SuccessResponse('Usuário criado.')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Atualiza o token de acesso' })
  async refresh(@Req() req: any, @Res() res: any) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      throw new BadRequestException('Refresh token não encontrado.');
    }

    try {
      const newAccessToken = await this.authService.refresh(refreshToken);
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 60 * 60 * 1000, // 1 hora
      });
      return res.status(200).json({ access_token: newAccessToken });
    } catch (error) {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      throw new UnauthorizedException('Refresh token inválido.');
    }
  }

  @Post('check')
  @ApiOperation({ summary: 'Verifica se o token de acesso é válido' })
  async check(@Req() req: any) {
    const accessToken = req.cookies['access_token'];
    return this.authService.check(accessToken);
  }

}
