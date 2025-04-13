import { UserAuthDto } from '../user/dtos/user-auth.dto';
import { AcceptInviteDto } from './dtos/accept-invite.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginResponseDto } from './dtos/login-response.dto';

export abstract class AuthInterface {
  abstract validateUser(email: string, password: string): Promise<any>;
  abstract findUserByEmail(email: string): Promise<{ status: string } | null>;
  abstract login(user: UserAuthDto): Promise<LoginResponseDto>;
  abstract register(user: CreateUserDto): Promise<void>;
  abstract registerWithoutPassword(user: CreateUserDto): Promise<void>;
  abstract refresh(refreshToken: string): Promise<string>;
  abstract check(access_token: string): Promise<boolean>;
}
