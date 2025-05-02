import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import { PropertyListDto } from './dtos/property-list.dto';
import { PropertyDto } from './dtos/property.dto';

export abstract class PropertyInterface {
  abstract createProperty(createPropertyDto: CreatePropertyDto, imageBuffer: Buffer): Promise<void>;
  abstract updateProperty(id: string, updatePropertyDto: UpdatePropertyDto): Promise<void>;
  abstract deleteProperty(id: string): Promise<void>;
  abstract getMyProperties(userId: string): Promise<PropertyListDto[]>;
  abstract getAllProperties(search?: string): Promise<PropertyListDto[]>;
  abstract getPhotoDataById(photoId: string): Promise<Buffer>;
  abstract searchProperties(location: string, type: string): Promise<PropertyListDto[]>;
  abstract findById(id: string): Promise<PropertyDto>;
  abstract verifyExistingProperty(id: string): Promise<void>;
  //abstract addPhotos(propertyId: string, photoUrls: string[]): Promise<void>;
  //abstract removePhoto(propertyId: string, photoId: string): Promise<void>;
  }
