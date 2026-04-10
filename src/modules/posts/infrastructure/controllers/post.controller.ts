import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CreatePostDto } from '../../application/dtos/create-post.dto';
import { UpdatePostDto } from '../../application/dtos/update-post.dto';
import { CreatePostUseCase } from '../../application/use-cases/create-post.use-case';
import { DeletePostUseCase } from '../../application/use-cases/delete-post.use-case';
import { GetPostByIdUseCase } from '../../application/use-cases/get-post-by-id.use-case';
import { GetPostsUseCase } from '../../application/use-cases/get-posts.use-case';
import { UpdatePostUseCase } from '../../application/use-cases/update-post.use-case';
import { AddTagToPostUseCase } from '../../application/use-cases/add-tag-to-post.use-case';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Public } from '../../../shared/auth/infrastructure/guards/public.decorator';
import { GetPostBySlugUseCase } from '../../application/use-cases/get-post-by-slug.use-case';
import { UpdatePostSlugUseCase } from '../../application/use-cases/update-post-slug.use-case';
import { UpdatePostSlugDto } from '../../application/dtos/update-post-slug.dto';

@Controller('posts')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly getPostsUseCase: GetPostsUseCase,
    private readonly getPostByIdUseCase: GetPostByIdUseCase,
    private readonly addTagToPostUseCase: AddTagToPostUseCase,
    private readonly getPostBySlugUseCase: GetPostBySlugUseCase,
    private readonly updatePostSlugUseCase: UpdatePostSlugUseCase,
  ) {}

  @Get()
  public async getPosts() {
    const posts = await this.getPostsUseCase.execute();

    return posts.map((p) => p.toJSON());
  }

  @Get(':id')
  //@ApiBearerAuth() // Si seulmement accessible aux utilisateurs authentifiés
  @Public()
  @UseGuards(JwtAuthGuard)
  public async getPostById(@Param('id') id: string) {
    const post = await this.getPostByIdUseCase.execute(id);

    return post?.toJSON();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async createPost(
    @Requester() user: UserEntity, // L'utilisateur extrait lié au token JWT
    @Body() input: CreatePostDto,
  ) {
    /*console.log('--- 1. CONTROLEUR ---');
    console.log('Input complet :', input);*/
    return this.createPostUseCase.execute(
      {
        title: input.title ?? '',
        content: input.content ?? '',
        authorId: user.id,
        slug: input.slug,
      },
      user,
    );
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async updatePost(
    @Param('id') id: string,
    @Body() input: UpdatePostDto,
    @Requester() user: UserEntity,
  ) {
    return this.updatePostUseCase.execute(id, input, user);
  }

  @Delete(':id')
  public async deletePost(@Param('id') id: string) {
    return this.deletePostUseCase.execute(id);
  }

  @Post(':postId/tags/:tagId')
  @HttpCode(HttpStatus.OK)
  async addTagToPost(
    @Param('postId') postId: string,
    @Param('tagId') tagId: string,
  ) {
    return await this.addTagToPostUseCase.execute(postId, tagId);
  }

  /**
   * Récupérer un article via son Slug
   * On utilise 'slug/:slug' pour éviter le conflit de route avec ':id'
   */
  @Get('slug/:slug')
  @Public() // Accessible à tous comme getPostById
  public async getPostBySlug(@Param('slug') slug: string) {
    const post = await this.getPostBySlugUseCase.execute(slug);
    return post?.toJSON();
  }

  /**
   * Modification manuelle le slug d'un article
   * Contrat : PATCH /posts/:id/slug
   */
  @Patch(':id/slug')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Modifier manuellement le slug d'un article" })
  @ApiParam({
    name: 'id',
    description: "L'ID technique de l'article",
    type: 'string',
  }) // Documente le paramètre de l'URL
  @ApiBody({
    description: "Le nouveau slug de l'article",
    schema: {
      type: 'object',
      properties: {
        slug: { type: 'string', example: 'nouveau-slug' },
      },
    },
  }) // Documente le corps de la requête
  public async updatePostSlug(
    @Param('id') id: string,
    @Body() input: UpdatePostSlugDto,
    @Requester() user: UserEntity,
  ): Promise<{ message: string }> {
    await this.updatePostSlugUseCase.execute(
      id,
      input.slug,
      user.id,
      user.getRole(),
    );
    return { message: 'Slug mis à jour avec succès.' };
  }
}
