import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { CommentContent } from '../../domain/value-objects/comment-content';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';

@Injectable()
export class AddCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository, // Injection inter-module
  ) {}

  async execute(
    postId: string,
    authorId: string,
    rawContent: string,
  ): Promise<CommentEntity> {
    // 1. Règle métier : l'article doit exister
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException(
        `Impossible de commenter : l'article avec l'ID ${postId} n'existe pas.`,
      );
    }

    // 2. Création et validation du contenu via le Value Object
    const content = new CommentContent(rawContent);

    // 3. Création de l'entité via la Factory Method
    const newComment = CommentEntity.create(content, authorId, postId);

    // 4. Sauvegarde en base de données
    await this.commentRepository.save(newComment);

    return newComment;
  }
}
