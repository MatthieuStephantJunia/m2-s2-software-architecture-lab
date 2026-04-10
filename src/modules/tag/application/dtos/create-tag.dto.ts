import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    //Régles Métier :
    description: 'Le nom du tag (minuscules, chiffres et tirets uniquement)',
    example: 'nodejs',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Le nom du tag doit être une chaîne de caractères.' })
  @Length(2, 50, {
    message: 'Le nom du tag doit contenir entre 2 et 50 caractères.',
  })
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Le nom du tag ne peut contenir que des lettres minuscules, des chiffres et des tirets.',
  })
  name!: string;
}
