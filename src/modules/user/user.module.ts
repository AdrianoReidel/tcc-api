import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { UserController } from './user.controller';
import { UserInterface } from './user.interface';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    {
      provide: UserInterface,
      useClass: UserService,
    },
  ],
  exports: [UserInterface],
})
export class UserModule {}
