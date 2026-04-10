import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostSlug } from '../../domain/value-objects/post-slug';

@Injectable()
export class UpdatePostSlugUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(
    postId: string,
    newSlugValue: string,
    userId: string,
    userRole: string,
  ): Promise<void> {
    // 1. Récupérer l'article existant
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException('Article introuvable.');
    }

    // 2. Vérification de l'autorisation (Auteur ou ADMIN uniquement)
    if (post.authorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException(
        "Seul l'auteur ou un administrateur peut modifier le slug.",
      );
    }

    // 3. Valider le nouveau slug via le Value Object
    const newSlug = new PostSlug(newSlugValue);

    // 4. Vérifier si ce nouveau slug est déjà utilisé par un AUTRE article
    const existingPost = await this.postRepository.getPostBySlug(
      newSlug.getValue(),
    );
    if (existingPost && existingPost.id !== postId) {
      throw new ConflictException(
        'Ce slug est déjà utilisé par un autre article.',
      );
    }

    // 5. Mettre à jour l'entité et sauvegarder
    post.updateSlug(newSlug);
    return this.postRepository.save(post);
  }
}
