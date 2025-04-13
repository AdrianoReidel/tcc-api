import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { PropertyController } from './property.controller';
import { PropertyInterface } from './property.interface';
import { PropertyService } from './property.service';

@Module({
  imports: [PrismaModule],
  controllers: [PropertyController],
  providers: [
    {
      provide: PropertyInterface,
      useClass: PropertyService,
    },
  ],
  exports: [PropertyInterface],
})
export class PropertyModule {}
