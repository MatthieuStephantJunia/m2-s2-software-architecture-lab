import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { CommentContent } from '../../domain/value-objects/comment-content';

@Injectable()
export class UpdateCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(
    postId: string,
    commentId: string,
    userId: string,
    userRole: string,
    rawContent: string,
  ) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment || comment.postId !== postId) {
      throw new NotFoundException('Commentaire introuvable.');
    }

    const normalizedRole = userRole.toLowerCase();
    const isAuthor = comment.authorId === userId;
    const hasPrivileges =
      normalizedRole === 'admin' || normalizedRole === 'moderator';

    if (!isAuthor && !hasPrivileges) {
      throw new ForbiddenException(
        "Vous n'avez pas le droit de modifier ce commentaire.",
      );
    }

    const content = new CommentContent(rawContent);
    comment.updateContent(content);
    await this.commentRepository.save(comment);

    return comment;
  }
}
