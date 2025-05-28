import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import { PropertyListDto } from './dtos/property-list.dto';
import { PropertyDto } from './dtos/property.dto';
import { PhotoResponseDto } from './dtos/photo-response.dto';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { ReservationDto } from './dtos/reservation.dto';
import { CreateRatingDto } from './dtos/create-property-rating.dto';
import { ReviewResponseDto } from './dtos/review-response.dto';

export abstract class PropertyInterface {
  abstract createProperty(createPropertyDto: CreatePropertyDto, imageBuffer: Buffer): Promise<void>;
  abstract updateProperty(id: string, updatePropertyDto: UpdatePropertyDto, imageBuffer: Buffer): Promise<void>;
  abstract deleteProperty(id: string): Promise<void>;
  abstract getMyProperties(userId: string): Promise<PropertyListDto[]>;
  abstract getAllProperties(search?: string): Promise<PropertyListDto[]>;
  abstract getPhotoDataById(photoId: string): Promise<Buffer>;
  abstract searchProperties(location: string, type: string): Promise<PropertyListDto[]>;
  abstract findById(id: string): Promise<PropertyDto>;
  abstract verifyExistingProperty(id: string): Promise<void>;
  abstract addPhotos(propertyId: string, imageBuffer: Buffer): Promise<void>;
  abstract removePhoto(propertyId: string, photoId: string): Promise<void>;
  abstract getPhotosByPropertyId(propertyId: string): Promise<PhotoResponseDto[]>;
  abstract getPhotosByPropertyIdSinglePage(propertyId: string): Promise<PhotoResponseDto[]>;
  abstract reserveProperty(
    propertyId: string,
    createReservationDto: CreateReservationDto,
    userId: string,
  ): Promise<void>;
  abstract createPropertyRating(propertyId: string, createRatingDto: CreateRatingDto, userId: string): Promise<void>;
  abstract createGuestRating(
    guestId: string,
    propertyId: string,
    createRatingDto: CreateRatingDto,
    userId: string,
  ): Promise<void>;
  abstract getMyReservations(userId: string): Promise<ReservationDto[]>;
  abstract getReservationsByPropertyId(propertyId: string): Promise<ReservationDto[]>;
  abstract getPropertyReviews(propertyId: string): Promise<ReviewResponseDto[]>;
}
