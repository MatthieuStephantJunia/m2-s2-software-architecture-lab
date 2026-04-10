import {
  Controller,
  Post,
  Get,
  Body, //TODO UseGuards, [a faire]
  HttpCode,
  HttpStatus,
  ConflictException,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CreateTagUseCase } from '../../application/use-cases/create-tag.use-case';
import { GetTagsUseCase } from '../../application/use-cases/get-tags.use-case';
import { CreateTagDto } from '../../application/dtos/create-tag.dto';
import { TagAlreadyExistsException } from '../../exceptions/tag-already-exists.exception';
import { DeleteTagUseCase } from '../../application/use-cases/delete-tag.use-case';
import { UpdateTagUseCase } from '../../application/use-cases/update-tag.use-case';
import { UpdateTagDto } from '../../application/dtos/update-tag.dto';

@ApiTags('Tags') // Catégorie dans l'interface Swagger
@Controller('tags')
export class TagsController {
  // Injection de nos Use Cases
  constructor(
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly getTagsUseCase: GetTagsUseCase,
    private readonly updateTagUseCase: UpdateTagUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Retourne une 201 Created en cas de succès

  // --- DOCUMENTATION SWAGGER ---
  @ApiOperation({ summary: 'Créer un nouveau tag (Admin uniquement)' })
  @ApiBearerAuth() // Indique à Swagger que cette route nécessite un token JWT
  @ApiResponse({ status: 201, description: 'Le tag a été créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides (Bad Request).' })
  @ApiResponse({ status: 401, description: 'Non authentifié.' })
  @ApiResponse({ status: 403, description: 'Accès refusé (Non Admin).' })
  @ApiResponse({ status: 409, description: 'Le tag existe déjà (Conflict).' })

  // --- SÉCURITÉ TODO [ a faire ] ---
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN')

  // ==========================================
  // ROUTE POST : Création
  async create(@Body() createTagDto: CreateTagDto) {
    try {
      // On passe les données validées au Use Case
      const tag = await this.createTagUseCase.execute({
        name: createTagDto.name,
      });

      // On retourne le résultat (NestJS va automatiquement le transformer en JSON)
      return {
        id: tag.getId(),
        name: tag.getName().getValue(),
        createdAt: tag.getCreatedAt(),
      };
    } catch (error) {
      if (error instanceof TagAlreadyExistsException) {
        throw new ConflictException(error.message);
      }
      throw error; // Re-throw other errors
    }
  }

  // ==========================================
  // ROUTE GET : Lecture
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Récupérer la liste de tous les tags' })
  @ApiResponse({
    status: 200,
    description: 'Liste des tags récupérée avec succès.',
  })
  // Pas de @UseGuards ici, la route est publique !
  async findAll() {
    const tags = await this.getTagsUseCase.execute();

    // On transforme le tableau d'entités métier en un tableau d'objets simples pour le client (Mapper)
    return tags.map((tag) => ({
      id: tag.getId(),
      name: tag.getName().getValue(),
    }));
  }

  // ==========================================
  // ROUTE DELETE : Suppression
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Code 204 : Succès, mais pas de contenu à renvoyer
  @ApiOperation({ summary: 'Supprimer un tag (Admin uniquement)' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: "L'ID du tag à supprimer",
    type: 'string',
  })
  @ApiResponse({
    status: 204,
    description: 'Le tag a été supprimé avec succès.',
  })
  @ApiResponse({
    status: 404,
    description: 'Tag introuvable.',
  })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN')
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteTagUseCase.execute(id);
    // On ne retourne rien car NestJS renverra automatiquement une réponse vide avec le code 204
  }

  // ==========================================
  // ROUTE PATCH : Modification
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modifier un tag existant (Admin uniquement)' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: "L'ID du tag à modifier",
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Le tag a été modifié avec succès.',
  })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 404, description: 'Tag introuvable.' })
  @ApiResponse({ status: 409, description: 'Nom de tag déjà utilisé.' })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const updatedTag = await this.updateTagUseCase.execute({
      id: id,
      name: updateTagDto.name,
    });

    return {
      id: updatedTag.getId(),
      name: updatedTag.getName().getValue(),
      createdAt: updatedTag.getCreatedAt(),
    };
  }
}
