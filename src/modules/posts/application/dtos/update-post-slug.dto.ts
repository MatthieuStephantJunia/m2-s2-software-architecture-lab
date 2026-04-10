import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class UpdatePostSlugDto {
  @ApiProperty({
    description:
      "Le nouveau slug de l'article (doit être unique, en minuscules, et sans espaces)",
    example: 'mon-nouveau-slug-personnalise',
  })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug!: string;
}
