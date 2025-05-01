import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PropertyInterface } from './property.interface';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import { PropertyListDto } from './dtos/property-list.dto';
import { PropertyDto } from './dtos/property.dto';
import { property, property_status, property_type } from '@prisma/client';

@Injectable()
export class PropertyService implements PropertyInterface {
  constructor(private readonly prisma: PrismaService) {}

  async createProperty(createPropertyDto: CreatePropertyDto): Promise<void> {
    await this.prisma.property.create({
      data: {
        title: createPropertyDto.title,
        description: createPropertyDto.description,
        pricePerUnit: createPropertyDto.pricePerUnit,
        operatingMode: createPropertyDto.operatingMode,
        street: createPropertyDto.street,
        city: createPropertyDto.city,
        state: createPropertyDto.state,
        country: createPropertyDto.country,
        zipCode: createPropertyDto.zipCode,
        hostId: createPropertyDto.hostId,
        type: createPropertyDto.type as property_type,
        status: createPropertyDto.status as property_status,
      },
    });
  }

  async getAllProperties(search?: string): Promise<PropertyListDto[]> {
    const whereClause = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as any } },
            { description: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};

    const properties = await this.prisma.property.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return properties.map((p) => this.toPropertyListDto(p));
  }

  async searchProperties(location: string, type: string): Promise<PropertyListDto[]> {
    // Construir a cláusula where com base nos parâmetros
    const whereClause: any = {};

    // Adicionar filtro por localização (cidade)
    if (location) {
      whereClause.city = { contains: location, mode: 'insensitive' };
    }

    // Adicionar filtro por tipo (HOUSING, EVENTS, SPORTS)
    if (type) {
      const validType = type.toUpperCase();
      if (Object.values(property_type).includes(validType as property_type)) {
        whereClause.type = validType;
      } else {
        throw new Error('Tipo de propriedade inválido. Use HOUSING, EVENTS ou SPORTS.');
      }
    }
    const properties = await this.prisma.property.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        hostId: true,
        pricePerUnit: true,
        operatingMode: true,
        type: true,
        city: true,
        state: true,
      },
    });

    return properties.map((p) => this.toPropertyListSearchDto(p));
  }

  private toPropertyListSearchDto(property: any): PropertyListDto {
    return {
      id: property.id,
      title: property.title,
      description: property.description,
      createdAt: property.createdAt,
      hostId: property.hostId,
      pricePerUnit: property.pricePerUnit,
      operatingMode: property.operatingMode,
      type: property.type,
      city: property.city,
      state: property.state,
    };
  }

  async findById(id: string): Promise<PropertyDto> {
    const prop = await this.prisma.property.findUnique({ where: { id } });
    if (!prop) {
      throw new NotFoundException(`Propriedade com ID "${id}" não encontrada.`);
    }
    return this.toPropertyDto(prop);
  }

  async updateProperty(id: string, updatePropertyDto: UpdatePropertyDto): Promise<void> {
    await this.verifyExistingProperty(id);

    await this.prisma.property.update({
      where: { id },
      data: {
        ...updatePropertyDto,
      },
    });
  }

  async deleteProperty(id: string): Promise<void> {
    await this.verifyExistingProperty(id);
    await this.prisma.property.delete({
      where: { id },
    });
  }

  async verifyExistingProperty(id: string): Promise<void> {
    const prop = await this.prisma.property.findUnique({ where: { id } });
    if (!prop) {
      throw new NotFoundException(`Propriedade com ID "${id}" não encontrada.`);
    }
  }

  async addPhotos(propertyId: string, photoUrls: string[]): Promise<void> {
    await this.verifyExistingProperty(propertyId);

    const photoData = photoUrls.map((url) => ({
      url,
      propertyId,
    }));

    await this.prisma.photo.createMany({
      data: photoData,
    });
  }

  async removePhoto(propertyId: string, photoId: string): Promise<void> {
    const photo = await this.prisma.photo.findUnique({ where: { id: photoId } });
    if (!photo || photo.propertyId !== propertyId) {
      throw new NotFoundException(`Foto não encontrada na propriedade.`);
    }

    await this.prisma.photo.delete({ where: { id: photoId } });
  }

  async getMyProperties(userId: string): Promise<PropertyListDto[]> {
    const properties = await this.prisma.property.findMany({
      where: { hostId: userId },
      orderBy: { createdAt: 'desc' },
    });
    return properties.map((p) => this.toPropertyListDto(p));
  }

  private toPropertyListDto(prop: property): PropertyListDto {
    return {
      id: prop.id,
      title: prop.title,
      description: prop.description,
      createdAt: prop.createdAt,
      hostId: prop.hostId,
      pricePerUnit: prop.pricePerUnit.toNumber(),
      operatingMode: prop.operatingMode,
      type: prop.type,
      city: prop.city,
      state: prop.state,
    };
  }

  private toPropertyDto(prop: property): PropertyDto {
    return {
      id: prop.id,
      title: prop.title,
      description: prop.description,
      type: prop.type,
      status: prop.status,
      street: prop.street,
      city: prop.city,
      state: prop.state,
      country: prop.country,
      zipCode: prop.zipCode,
      pricePerUnit: prop.pricePerUnit.toNumber(),
      operatingMode: prop.operatingMode,
      hostId: prop.hostId,
      createdAt: prop.createdAt,
      updatedAt: prop.updatedAt,
    };
  }
}
