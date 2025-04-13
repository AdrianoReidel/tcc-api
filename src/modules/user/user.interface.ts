import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserListDto } from './dtos/user-list.dto';
import { UserDto } from './dtos/user.dto';

export abstract class UserInterface {
  abstract updatePassword(id: string, user: UpdatePasswordDto): Promise<void>;
  abstract updateUser(id: string, updateUserDto: UpdateUserDto): Promise<void>;
  abstract deleteUser(id: string): Promise<void>;
  abstract getUsers(search?: string, status?: string): Promise<UserListDto[]>;
  abstract findById(id: string): Promise<UserDto>;
}
