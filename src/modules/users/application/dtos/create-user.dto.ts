import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { UserRole } from '../../domain/entities/user.entity';

const USER_ROLES: UserRole[] = ['user', 'moderator', 'admin', 'writer'];

export class CreateUserDto {
  @ApiProperty({
    description: "Le nom d'utilisateur (doit être unique)",
    example: 'johndoe_89',
    minLength: 3,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: "Le nom d'utilisateur doit contenir au moins 3 caractères.",
  })
  @MaxLength(30, {
    message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères.",
  })
  username!: string;

  @ApiProperty({
    description: "L'adresse email de l'utilisateur",
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: "L'email fourni n'est pas valide." })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: "Le rôle de l'utilisateur",
    enum: USER_ROLES,
    example: 'user',
  })
  @IsIn(USER_ROLES, { message: 'Le role est invalide.' })
  role!: UserRole;

  @ApiProperty({
    description:
      "Le mot de passe de l'utilisateur (min 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial)",
    example: 'P@ssw0rd2026!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères.',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Le mot de passe est trop faible.',
  })
  password!: string;
}
