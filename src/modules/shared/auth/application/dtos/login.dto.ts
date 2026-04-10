import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: "Le nom d'utilisateur (ou email selon ton implémentation)",
    example: 'writer_user',
  })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({
    description: 'Le mot de passe',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
