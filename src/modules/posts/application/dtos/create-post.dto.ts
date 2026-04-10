import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Mon super titre', description: 'Le titre du post' })
  @IsString()
  @IsNotEmpty()
  title!: string;
  @IsString()
  @ApiPropertyOptional({
    description:
      "Le slug personnalisé de l'article. S'il est omis, il sera généré automatiquement à partir du titre.",
    example: 'mon-super-article', // 'example' montre une valeur indicative dans la doc
    default: 'mon-super-article', // 'default' pré-remplit physiquement le champ dans l'interface Swagger
  })
  slug?: string;

  @ApiProperty({
    example: 'Voici le contenu...',
    description: "Le contenu de l'article",
  })
  @IsString()
  @IsNotEmpty()
  content!: string;
}
