import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostEntity } from '../../domain/entities/post.entity';

@Injectable()
export class GetPostBySlugUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(slug: string): Promise<PostEntity> {
    const post = await this.postRepository.getPostBySlug(slug);

    if (!post) {
      // Le sujet spécifie une erreur 404 si le slug n'existe pas
      throw new NotFoundException(
        `Article avec le slug "${slug}" introuvable.`,
      );
    }

    return post;
  }
}
