import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserInterface } from './user.interface';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserListDto } from './dtos/user-list.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UserService implements UserInterface {
  constructor(private prisma: PrismaService) {}

  async verifyExistingUser(id: string): Promise<void> {
    const user = await this.prisma.app_user.findFirst({
      where: { id },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<void> {
    await this.verifyExistingUser(id);

    const hashedPassword = await bcrypt.hash(updatePasswordDto.password, 8);
    await this.prisma.app_user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    await this.verifyExistingUser(id);

    const updateData: any = {
      name: updateUserDto.name,
      email: updateUserDto.email,
      role: updateUserDto.role,
      status: updateUserDto.status,
      // Se houver outros campos em UpdateUserDto, adicione-os aqui
    };

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 8);
    }

    await this.prisma.app_user.update({
      where: { id },
      data: updateData,
    });
  }
  
  async deleteUser(id: string): Promise<void> {
    await this.verifyExistingUser(id);

    const user = await this.prisma.app_user.findFirst({
      where: { id },
    });

    if (!user || !user.id) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    await this.prisma.app_user.delete({
      where: { id: user.id },
    });
  }
  
  async getUsers(search?: string, status?: string): Promise<UserListDto[]> {
    const whereClause: any = {};
  
    if (status) {
      whereClause.status = status.toUpperCase();
    }
  
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
  
    const users = await this.prisma.app_user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    }));
  }
  
  async findById(id: string): Promise<UserDto> {
    const user = await this.prisma.app_user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        cpf: true,
        birthDate: true,
        address: true,
        addressNumber: true,
        neighborhood: true,
        postalCode: true,
        city: true,
        addressComplement: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }
}
