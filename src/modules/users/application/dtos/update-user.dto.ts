import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { UserRole } from '../../domain/entities/user.entity';

const USER_ROLES: UserRole[] = ['user', 'moderator', 'admin', 'writer'];

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: "Le nom d'utilisateur (optionnel)",
    example: 'johndoe_90',
    minLength: 3,
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: "Le nom d'utilisateur doit contenir au moins 3 caractères.",
  })
  @MaxLength(30, {
    message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères.",
  })
  username?: string;

  @ApiPropertyOptional({
    description: "L'adresse email de l'utilisateur (optionnelle)",
    example: 'john.updated@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: "L'email fourni n'est pas valide." })
  email?: string;

  @ApiPropertyOptional({
    description: "Le rôle de l'utilisateur (optionnel)",
    enum: USER_ROLES,
    example: 'writer',
  })
  @IsOptional()
  @IsIn(USER_ROLES, { message: 'Le role est invalide.' })
  role?: UserRole;
}
