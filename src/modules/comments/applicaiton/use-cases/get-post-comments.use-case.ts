import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { PostNotFoundException } from '../../../posts/domain/exceptions/post-not-found.exception';

@Injectable()
export class GetPostCommentsUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async execute(postId: string): Promise<CommentEntity[]> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new PostNotFoundException(postId);
    }

    const comments = await this.commentRepository.findByPostId(postId);
    return comments;
  }
}
