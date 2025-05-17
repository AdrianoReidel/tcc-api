import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
  Delete,
  Post,
  Req,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Res,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
import { PropertyInterface } from './property.interface';
import { SuccessResponse } from 'src/decorators/success-response.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PropertyOwnershipGuard } from './guards/property-ownership.guard';
import { PropertyListDto } from './dtos/property-list.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import { PropertyDto } from './dtos/property.dto';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PhotoResponseDto } from './dtos/photo-response.dto';
import { CreateReservationDto } from './dtos/create-reservation.dto';

@ApiTags('Property')
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyInterface) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @SuccessResponse('Propriedade criada.')
  @ApiOperation({ summary: 'Cria uma nova propriedade.' })
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({ status: 201, description: 'Propriedade criada com sucesso.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: undefined, // Não salvar em disco, manter em memória
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif)/)) {
          return callback(new Error('Apenas imagens (jpg, jpeg, png, gif) são permitidas.'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
    }),
  )
  async createProperty(
    @Req() req: any,
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    createPropertyDto.hostId = req.user.sub;

    // Verificar se o arquivo foi enviado
    if (!file) {
      throw new Error('A imagem é obrigatória.');
    }

    // Passar o buffer da imagem para o serviço
    await this.propertyService.createProperty(createPropertyDto, file.buffer);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @SuccessResponse('Propriedade atualizada.')
  @ApiOperation({ summary: 'Atualiza uma propriedade existente.' })
  @ApiBody({ type: UpdatePropertyDto })
  @ApiResponse({ status: 200, description: 'Propriedade atualizada.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: undefined, // Não salvar em disco, manter em memória
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif)/)) {
          return callback(new Error('Apenas imagens (jpg, jpeg, png, gif) são permitidas.'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
    }),
  )
  async updateProperty(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @UploadedFile() file?: Express.Multer.File, // O arquivo é opcional
  ): Promise<void> {
    // Passar o buffer da imagem para o serviço apenas se um arquivo for enviado
    await this.propertyService.updateProperty(id, updatePropertyDto, file?.buffer);
  }

  @UseGuards(JwtAuthGuard)
  @SuccessResponse('Fotos adicionadas à propriedade.')
  @ApiOperation({ summary: 'Adiciona fotos a uma propriedade.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: undefined, // Não salvar em disco, manter em memória
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif)/)) {
          return callback(new Error('Apenas imagens (jpg, jpeg, png, gif) são permitidas.'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
    }),
  )
  @Post(':id/photos')
  async addPhotos(@Param('id') propertyId: string, @UploadedFile() file: Express.Multer.File): Promise<void> {
    await this.propertyService.addPhotos(propertyId, file.buffer);
  }

  @SuccessResponse('Lista de propriedades.')
  @ApiOperation({ summary: 'Retorna a lista de propriedades.' })
  @ApiResponse({ status: 200, description: 'Lista de propriedades.' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @Get()
  async getAllProperties(@Query('search') search?: string): Promise<PropertyListDto[]> {
    return this.propertyService.getAllProperties(search);
  }

  @Get('photos/:photoId')
  @ApiOperation({ summary: 'Retorna os dados da imagem pelo photoId.' })
  @ApiResponse({ status: 200, description: 'Dados binários da imagem.' })
  @ApiResponse({ status: 404, description: 'Imagem não encontrada.' })
  @ApiParam({ name: 'photoId', required: true, type: Number, description: 'ID da foto' })
  async getPhotoDataById(@Param('photoId') photoId: string, @Res() res: Response): Promise<void> {
    try {
      const photoData = await this.propertyService.getPhotoDataById(photoId);

      res.setHeader('Content-Type', 'image/jpeg'); // ou image/png, dependendo do tipo
      res.send(photoData); // Envia o buffer como binário
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Imagem não encontrada' });
    }
  }

  @Get('search')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar propriedades por localização e tipo' })
  @ApiResponse({ status: 200, description: 'Lista de propriedades filtradas.', type: [PropertyListDto] })
  @ApiQuery({ name: 'location', required: true, type: String, description: 'Cidade para filtrar as propriedades' })
  @ApiQuery({
    name: 'type',
    required: true,
    type: String,
    description: 'Tipo de propriedade (HOUSING, EVENTS, SPORTS)',
  })
  async searchProperties(@Query('location') location: string, @Query('type') type: string): Promise<PropertyListDto[]> {
    return this.propertyService.searchProperties(location, type);
  }

  @UseGuards(JwtAuthGuard)
  @SuccessResponse('Lista de propriedades do usuário.')
  @ApiOperation({ summary: 'Retorna todas as propriedades do usuário autenticado.' })
  @ApiResponse({ status: 200, description: 'Lista de propriedades do usuário.' })
  @Get('me')
  async getMyProperties(@Req() req: any): Promise<PropertyListDto[]> {
    const userId = req.user.sub;
    return this.propertyService.getMyProperties(userId);
  }

  @SuccessResponse('Detalhes da propriedade.')
  @ApiOperation({ summary: 'Retorna detalhes de uma propriedade por ID.' })
  @ApiResponse({ status: 200, description: 'Detalhes da propriedade.' })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<PropertyDto> {
    return this.propertyService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @SuccessResponse('Fotos da propriedade.')
  @ApiOperation({ summary: 'Retorna fotos da propriedade pelo ID.' })
  @ApiResponse({ status: 200, description: 'Fotos da propriedade.', type: [PhotoResponseDto] })
  @Get(':propertyId/photos')
  async getPhotosByPropertyId(@Param('propertyId') propertyId: string): Promise<PhotoResponseDto[]> {
    if (!propertyId) {
      throw new NotFoundException('Parâmetro propertyId é obrigatório.');
    }
    try {
      const photos = await this.propertyService.getPhotosByPropertyId(propertyId);
      return photos;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Erro ao buscar fotos da propriedade.');
    }
  }

  @SuccessResponse('Fotos da propriedade para single page.')
  @ApiOperation({ summary: 'Retorna fotos da propriedade pelo ID.' })
  @ApiResponse({ status: 200, description: 'Fotos da propriedade.', type: [PhotoResponseDto] })
  @Get(':propertyId/photosSinglePage')
  async getPhotosByPropertyIdSinglePage(@Param('propertyId') propertyId: string): Promise<PhotoResponseDto[]> {
    if (!propertyId) {
      throw new NotFoundException('Parâmetro propertyId é obrigatório.');
    }
    try {
      const photos = await this.propertyService.getPhotosByPropertyIdSinglePage(propertyId);
      return photos;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Erro ao buscar fotos da propriedade.');
    }
  }

  @UseGuards(JwtAuthGuard)
  @SuccessResponse('Propriedade deletada.')
  @ApiOperation({ summary: 'Deleta uma propriedade.' })
  @ApiResponse({ status: 200, description: 'Propriedade deletada.' })
  @Delete(':id')
  async deleteProperty(@Param('id') id: string): Promise<void> {
    await this.propertyService.deleteProperty(id);
  }

  @UseGuards(JwtAuthGuard)
  @SuccessResponse('Foto removida da propriedade.')
  @ApiOperation({ summary: 'Remove uma foto de uma propriedade.' })
  @Delete(':propertyId/photos/:photoId')
  async removePhoto(@Param('propertyId') propertyId: string, @Param('photoId') photoId: string): Promise<void> {
    await this.propertyService.removePhoto(propertyId, photoId);
  }

  @UseGuards(JwtAuthGuard)
  @SuccessResponse('Reserva criada com sucesso.')
  @ApiOperation({ summary: 'Cria uma reserva para uma propriedade.' })
  @ApiResponse({ status: 201, description: 'Reserva criada.' })
  @Post(':propertyId/reserve')
  async reserveProperty(
    @Param('propertyId') propertyId: string,
    @Body() createReservationDto: CreateReservationDto,
    @Req() req: any,
  ): Promise<void> {
    if (!propertyId) {
      throw new NotFoundException('Parâmetro propertyId é obrigatório.');
    }
    const userId = req.user.sub;
    try {
      await this.propertyService.reserveProperty(propertyId, createReservationDto, userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Erro ao criar a reserva.');
    }
  }
}
