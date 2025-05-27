import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PropertyInterface } from './property.interface';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import { PropertyListDto } from './dtos/property-list.dto';
import { PropertyDto } from './dtos/property.dto';
import { property, property_status, property_type } from '@prisma/client';
import { PhotoResponseDto } from './dtos/photo-response.dto';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { ReservationDto } from './dtos/reservation.dto';
import { CreateRatingDto } from './dtos/create-property-rating.dto';
import { ReviewResponseDto } from './dtos/review-response.dto';

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
        photos: true,
        reservations: {
          where: {
            status: {
              not: 'CANCELED', // Desconsiderar reservas canceladas
            },
          },
        },
      },
    });

    if (!prop) {
      throw new NotFoundException(`Propriedade com ID "${id}" não encontrada.`);
    }

    return this.toPropertyDto(prop);
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
      hostId: prop.hostId,
      createdAt: prop.createdAt,
      updatedAt: prop.updatedAt,
      operatingMode: prop.operatingMode,
      photoIds: prop.photos.map((photo: any) => photo.id),
      reservations: prop.reservations.map((reservation: any) => ({
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        selectedTime: reservation.selectedTime,
      })),
    };
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

    // Iniciar uma transação para garantir consistência
    await this.prisma.$transaction(async (prisma) => {
      // 1. Excluir registros dependentes (exemplo: avaliações)
      await prisma.review.deleteMany({
        where: { reservation: { propertyId: id } },
      });

      // 2. Excluir todas as reservas associadas à propriedade
      await prisma.reservation.deleteMany({
        where: { propertyId: id },
      });

      // 3. Buscar todas as fotos associadas à propriedade
      const photos = await prisma.photo.findMany({
        where: { propertyId: id },
        select: { id: true },
      });

      // 4. Deletar cada foto usando o método removePhoto
      for (const photo of photos) {
        await this.removePhoto(id, photo.id);
      }

      // 5. Deletar a propriedade
      await prisma.property.delete({
        where: { id },
      });
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

  async reserveProperty(
    propertyId: string,
    createReservationDto: CreateReservationDto,
    guestId: string,
  ): Promise<void> {
    // Verificar se a propriedade existe
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Propriedade não encontrada.');
    }

    // Validar datas e calcular o preço
    const { startDate, endDate, selectedTime } = createReservationDto;
    let totalPrice: number;

    if (property.type === 'SPORTS') {
      if (!startDate || !selectedTime) {
        throw new Error('Data e horário são obrigatórios para reservas de esportes.');
      }
      totalPrice = property.pricePerUnit.toNumber(); // Preço fixo por horário
    } else {
      if (!startDate || !endDate) {
        throw new Error('Data de início e fim são obrigatórias para hospedagens e eventos.');
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (property.type === 'HOUSING') {
        totalPrice = diffDays > 1 ? property.pricePerUnit.toNumber() * (diffDays - 1) : 0; // Preço por noite
      } else {
        totalPrice = diffDays * property.pricePerUnit.toNumber(); // Preço por dia (EVENTS)
      }
    }

    // Usar selectedTime como hora (inteiro) diretamente, ou 0 para tipos que não usam horário
    const finalSelectedTime = property.type === 'SPORTS' ? selectedTime || 0 : 0;

    // Criar a reserva
    await this.prisma.reservation.create({
      data: {
        propertyId,
        guestId,
        checkIn: new Date(startDate),
        checkOut: endDate ? new Date(endDate) : new Date(startDate),
        selectedTime: finalSelectedTime,
        totalPrice,
        status: 'PENDING',
      },
    });
  }

  async createPropertyRating(propertyId: string, createRatingDto: CreateRatingDto, userId: string): Promise<void> {
    // Verificar se a propriedade existe
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Propriedade não encontrada.');
    }

    // Verificar se há uma reserva válida para o usuário e a propriedade
    const reservation = await this.prisma.reservation.findFirst({
      where: {
        propertyId,
        guestId: userId,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Nenhuma reserva encontrada para esta propriedade e usuário.');
    }

    // Validar a nota (deve estar entre 1 e 5)
    const { rating, comment, reservationId } = createRatingDto;
    if (rating < 1 || rating > 5) {
      throw new Error('A nota deve estar entre 1 e 5.');
    }

    // Criar a avaliação
    await this.prisma.review.create({
      data: {
        reservationId: reservationId || reservation.id,
        authorId: userId,
        rating,
        comment,
        type: 'GUEST_TO_HOST',
      },
    });
  }

  async getMyReservations(guestId: string): Promise<ReservationDto[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        guestId,
      },
      include: {
        property: true,
      },
    });

    return reservations.map((reservation) => ({
      id: reservation.id,
      propertyId: reservation.propertyId,
      propertyTitle: reservation.property.title,
      propertyType: reservation.property.type,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      selectedTime: reservation.selectedTime,
      totalPrice: reservation.totalPrice.toNumber(),
      status: reservation.status,
    }));
  }

  async getReservationsByPropertyId(propertyId: string): Promise<ReservationDto[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        propertyId,
      },
      include: {
        property: true,
        guest: true, // Inclui os dados do hóspede para obter o nome
      },
    });

    return reservations.map((reservation) => ({
      id: reservation.id,
      propertyId: reservation.propertyId,
      propertyTitle: reservation.property.title,
      propertyType: reservation.property.type,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      selectedTime: reservation.selectedTime,
      totalPrice: reservation.totalPrice.toNumber(),
      status: reservation.status,
      guestName: reservation.guest.name,
    }));
  }

  async getPropertyReviews(propertyId: string): Promise<ReviewResponseDto[]> {
    // Verificar se a propriedade existe
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Propriedade não encontrada.');
    }

    // Buscar todas as avaliações associadas à propriedade
    const reviews = await this.prisma.review.findMany({
      where: {
        reservation: {
          propertyId,
        },
      },
      include: {
        author: {
          select: {
            name: true, // Inclui o nome do autor da avaliação
          },
        },
        reservation: {
          select: {
            id: true,
            checkIn: true,
            checkOut: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Ordena por data de criação, mais recente primeiro
      },
    });

    // Formatar a resposta para corresponder ao ReviewResponseDto
    return reviews.map((review) => ({
      id: review.id,
      reservationId: review.reservationId,
      authorName: review.author.name,
      rating: review.rating,
      comment: review.comment,
      type: review.type,
      createdAt: review.createdAt,
      checkIn: review.reservation.checkIn,
      checkOut: review.reservation.checkOut,
    }));
  }
}
