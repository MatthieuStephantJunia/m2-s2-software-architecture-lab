import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/comment.repository';

@Injectable()
export class DeleteCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(
    commentId: string,
    userId: string,
    userRole: string,
  ): Promise<void> {
    // 1. Récupérer le commentaire
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Commentaire introuvable.');
    }

    // 2. Vérifier les autorisations
    const isAuthor = comment.authorId === userId;
    const hasPrivileges = userRole === 'ADMIN' || userRole === 'MODERATOR';

    if (!isAuthor && !hasPrivileges) {
      throw new ForbiddenException(
        "Vous n'avez pas le droit de supprimer ce commentaire.",
      );
    }

    // 3. Suppression
    await this.commentRepository.delete(commentId);
  }
}
