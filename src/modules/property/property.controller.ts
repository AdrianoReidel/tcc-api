import { Body, Controller, Get, Param, Put, Query, UseGuards, Delete, Post, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PropertyInterface } from './property.interface';
import { SuccessResponse } from 'src/decorators/success-response.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PropertyOwnershipGuard } from './guards/property-ownership.guard';
import { PropertyListDto } from './dtos/property-list.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import { PropertyDto } from './dtos/property.dto';
import { CreatePropertyDto } from './dtos/create-property.dto';

@ApiTags('Property')
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyInterface) {}

  @UseGuards(JwtAuthGuard)
  @SuccessResponse('Propriedade criada.')
  @ApiOperation({ summary: 'Cria uma nova propriedade.' })
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({ status: 201, description: 'Propriedade criada com sucesso.' })
  @Post()
  async createProperty(@Req() req: any, @Body() createPropertyDto: CreatePropertyDto): Promise<void> {
    createPropertyDto.hostId = req.user.sub;
    await this.propertyService.createProperty(createPropertyDto);
  }

  @UseGuards(JwtAuthGuard)
  @SuccessResponse('Lista de propriedades.')
  @ApiOperation({ summary: 'Retorna a lista de propriedades.' })
  @ApiResponse({ status: 200, description: 'Lista de propriedades.' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @Get()
  async getAllProperties(@Query('search') search?: string): Promise<PropertyListDto[]> {
    return this.propertyService.getAllProperties(search);
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

  @UseGuards(JwtAuthGuard)
  @SuccessResponse('Detalhes da propriedade.')
  @ApiOperation({ summary: 'Retorna detalhes de uma propriedade por ID.' })
  @ApiResponse({ status: 200, description: 'Detalhes da propriedade.' })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<PropertyDto> {
    return this.propertyService.findById(id);
  }

  @UseGuards(JwtAuthGuard, PropertyOwnershipGuard)
  @SuccessResponse('Propriedade atualizada.')
  @ApiOperation({ summary: 'Atualiza uma propriedade existente.' })
  @ApiBody({ type: UpdatePropertyDto })
  @ApiResponse({ status: 200, description: 'Propriedade atualizada.' })
  @Put(':id')
  async updateProperty(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto): Promise<void> {
    await this.propertyService.updateProperty(id, updatePropertyDto);
  }

  @UseGuards(JwtAuthGuard, PropertyOwnershipGuard)
  @SuccessResponse('Propriedade deletada.')
  @ApiOperation({ summary: 'Deleta uma propriedade.' })
  @ApiResponse({ status: 200, description: 'Propriedade deletada.' })
  @Delete(':id')
  async deleteProperty(@Param('id') id: string): Promise<void> {
    await this.propertyService.deleteProperty(id);
  }

  @UseGuards(JwtAuthGuard, PropertyOwnershipGuard)
  @SuccessResponse('Fotos adicionadas à propriedade.')
  @ApiOperation({ summary: 'Adiciona fotos a uma propriedade.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photoUrls: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  @Post(':id/photos')
  async addPhotos(@Param('id') propertyId: string, @Body('photoUrls') photoUrls: string[]): Promise<void> {
    await this.propertyService.addPhotos(propertyId, photoUrls);
  }

  @UseGuards(JwtAuthGuard, PropertyOwnershipGuard)
  @SuccessResponse('Foto removida da propriedade.')
  @ApiOperation({ summary: 'Remove uma foto de uma propriedade.' })
  @Delete(':propertyId/photos/:photoId')
  async removePhoto(@Param('propertyId') propertyId: string, @Param('photoId') photoId: string): Promise<void> {
    await this.propertyService.removePhoto(propertyId, photoId);
  }

  @UseGuards(JwtAuthGuard, PropertyOwnershipGuard)
  @SuccessResponse('Comodidades adicionadas à propriedade.')
  @ApiOperation({ summary: 'Adiciona comodidades (commodities) a uma propriedade.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        commodityIds: {
          type: 'array',
          items: { type: 'number' },
        },
      },
    },
  })
  @Post(':id/commodities')
  async addCommodities(@Param('id') propertyId: string, @Body('commodityIds') commodityIds: number[]): Promise<void> {
    await this.propertyService.addCommodities(propertyId, commodityIds);
  }

  @UseGuards(JwtAuthGuard, PropertyOwnershipGuard)
  @SuccessResponse('Comodidades removidas da propriedade.')
  @ApiOperation({ summary: 'Remove comodidades (commodities) de uma propriedade.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        commodityIds: {
          type: 'array',
          items: { type: 'number' },
        },
      },
    },
  })
  @Delete(':id/commodities')
  async removeCommodities(
    @Param('id') propertyId: string,
    @Body('commodityIds') commodityIds: number[],
  ): Promise<void> {
    await this.propertyService.removeCommodities(propertyId, commodityIds);
  }
}
