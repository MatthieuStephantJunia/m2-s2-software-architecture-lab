import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { UserCannotUpdatePostException } from '../../domain/exceptions/user-cannot-update-post.exception';

@Injectable()
export class UpdatePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
  ) {}

  execute = async (
    id: string,
    input: UpdatePostDto,
    user: UserEntity,
  ): Promise<void> => {
    this.loggingService.log('UpdatePostUseCase.execute');
    const post = await this.postRepository.getPostById(id);

    if (!post) {
      throw new PostNotFoundException(id);
    }

    if (!user.permissions.posts.canUpdateContent(post)) {
      throw new UserCannotUpdatePostException();
    }

    post.update(input.title, input.content);
    await this.postRepository.updatePost(id, post);
  };
}
