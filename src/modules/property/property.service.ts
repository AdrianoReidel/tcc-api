import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PropertyInterface } from './property.interface';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import { PropertyListDto } from './dtos/property-list.dto';
import { PropertyDto } from './dtos/property.dto';
import { property, property_status, property_type } from '@prisma/client';
import { PhotoResponseDto } from './dtos/photo-response.dto';

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
        isCover: true, // Definindo a primeira foto como capa
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
          where: {
            isCover: true,
          },
          select: {
            id: true,
            propertyId: true,
          },
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
      include: {
        photos: {
          where: {
            isCover: true,
          },
          select: {
            id: true,
            propertyId: true,
          },
        },
      },
    });

    return properties.map((p) => {
      const matchingPhoto = p.photos.find((photo) => photo.propertyId === p.id);
      return this.toPropertyListDto({
        ...p,
        photoId: matchingPhoto?.id,
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

  async findById(id: string): Promise<PropertyDto> {
    const prop = await this.prisma.property.findUnique({
      where: { id },
      include: {
        photos: true, // Inclui os registros da tabela photo
      },
    });

    if (!prop) {
      throw new NotFoundException(`Propriedade com ID "${id}" não encontrada.`);
    }

    return this.toPropertyDto(prop);
  }

  async updateProperty(id: string, updatePropertyDto: UpdatePropertyDto, imageBuffer?: Buffer): Promise<void> {
    // Verificar se a propriedade existe
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: { photos: true },
    });

    if (!property) {
      throw new NotFoundException('Propriedade não encontrada.');
    }

    // Atualizar os dados da propriedade
    const updatedData: any = { ...updatePropertyDto };

    // Se uma nova imagem foi enviada, atualizar ou criar a foto
    if (imageBuffer) {
      // Se já existe uma foto de capa, atualizá-la
      const existingPhoto = property.photos.find((photo) => photo.isCover);
      if (existingPhoto) {
        await this.prisma.photo.update({
          where: { id: existingPhoto.id },
          data: {
            data: imageBuffer,
          },
        });
      } else {
        // Se não existe foto de capa, criar uma nova
        await this.prisma.photo.create({
          data: {
            propertyId: id,
            data: imageBuffer,
            isCover: true,
          },
        });
      }
    }

    // Atualizar os outros campos da propriedade
    await this.prisma.property.update({
      where: { id },
      data: updatedData,
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
        isCover: false,
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

  async getPhotosByPropertyId(propertyId: string): Promise<PhotoResponseDto[]> {
    await this.verifyExistingProperty(propertyId);

    const photos = await this.prisma.photo.findMany({
      where: {
        propertyId,
        isCover: false,
      },
      select: {
        id: true,
        data: true,
        propertyId: true,
      },
    });

    return photos.map((photo) => ({
      id: photo.id,
      data: photo.data,
      propertyId: photo.propertyId,
    }));
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

  private toPropertyDto(prop: any): PropertyDto {
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
      photoIds: prop.photos.map((photo) => photo.id),
    };
  }

  async getPhotosByPropertyIdSinglePage(propertyId: string): Promise<PhotoResponseDto[]> {
    await this.verifyExistingProperty(propertyId);

    const photos = await this.prisma.photo.findMany({
      where: {
        propertyId,
      },
      select: {
        id: true,
        data: true,
        propertyId: true,
      },
    });

    return photos.map((photo) => ({
      id: photo.id,
      data: photo.data,
      propertyId: photo.propertyId,
    }));
  }
}
