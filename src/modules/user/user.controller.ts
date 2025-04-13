import { Body, Controller, Get, Param, Put, Query, Request, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { UserInterface } from './user.interface';
import { SuccessResponse } from 'src/decorators/success-response.decorator';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserListDto } from './dtos/user-list.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserInterface) {}

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @SuccessResponse('Lista de usuários filtrada.')
  @ApiOperation({ summary: 'Retorna a lista de usuários com opção de filtro por status.' })
  @ApiResponse({ status: 200, description: 'Lista de usuários.' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @Get()
  async getUsers(
    @Query('search') search?: string, 
    @Query('status') status?: string
  ): Promise<UserListDto[]> {
    return this.userService.getUsers(search, status);
  }

  @UseGuards(JwtAuthGuard)
  @SuccessResponse('Detalhes do usuário.')
  @ApiOperation({ summary: 'Retorna os detalhes do usuário logado' })
  @ApiResponse({ status: 200, description: 'Detalhes do usuário.' })
  @Get('me')
  async getUserMeById(@Request() req): Promise<UserDto> {
    const id = req.user.sub
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @SuccessResponse('Detalhes do usuário.')
  @ApiOperation({ summary: 'Retorna os detalhes do usuário por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes do usuário.' })
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserDto> {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @SuccessResponse('Senha alterada.')
  @ApiOperation({ summary: 'Altera a senha do usuário autenticado' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({ status: 200, description: 'Senha alterada.' })
  @Put('password')
  async updatePassword(@Body() body: UpdatePasswordDto, @Request() req): Promise<void> {
    const { userId } = req.user;
    await this.userService.updatePassword(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @SuccessResponse('Usuário alterado.')
  @ApiOperation({ summary: 'Altera o usuário' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuário alterado.' })
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<void> {
    await this.userService.updateUser(id, body);
  }

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @SuccessResponse('Usuário deletado.')
  @ApiOperation({ summary: 'Deleta o usuário' })
  @ApiResponse({ status: 200, description: 'Usuário deletado.' })
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
