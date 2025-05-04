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

  async createProperty(createPropertyDto: CreatePropertyDto, imageBuffer: Buffer): Promise<void> {
    // Criar a propriedade
    const property = await this.prisma.property.create({
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
        status: (createPropertyDto.status || 'AVAILABLE') as property_status,
      },
    });

    // Criar o registro na tabela photo com o buffer da imagem
    await this.prisma.photo.create({
      data: {
        data: imageBuffer,
        propertyId: property.id,
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
      include: {
        photos: {
          select: {
            id: true,
            propertyId: true,
          },
          take: 1, // Pega apenas a primeira foto
        },
      },
    });
  
    return properties.map((p) => {
      // Filtra fotos onde propertyId é igual ao id na lógica da aplicação
      const matchingPhoto = p.photos.find((photo) => photo.propertyId === p.id);
      return this.toPropertyListDto({
        ...p,
        photoId: matchingPhoto?.id, // Inclui o ID da foto, se encontrado
      });
    });
  }

  async getPhotoDataById(photoId: string): Promise<Buffer> {
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
      select: { data: true }, // Campo BLOB
    });

    if (!photo || !photo.data) {
      throw new NotFoundException('Imagem não encontrada');
    }

    return photo.data; // Retorna o BLOB como Buffer
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

    return properties.map((p) => this.toPropertyListDto(p));
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
    // Verificar se a propriedade existe
    await this.verifyExistingProperty(id);

    // Buscar todas as fotos associadas à propriedade
    const photos = await this.prisma.photo.findMany({
      where: { propertyId: id },
      select: { id: true }, // Selecionar apenas o ID das fotos
    });

    // Deletar cada foto usando o método removePhoto
    for (const photo of photos) {
      await this.removePhoto(id, photo.id);
    }

    // Após deletar todas as fotos, deletar a propriedade
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

  async addPhotos(propertyId: string, imageBuffer: Buffer): Promise<void> {
    await this.verifyExistingProperty(propertyId);
    await this.prisma.photo.create({
      data: {
        data: imageBuffer,
        propertyId: propertyId,
      },
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

  private toPropertyListDto(prop: any): PropertyListDto {
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
      photoId: prop.photoId,
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
