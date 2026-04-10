import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';

@Injectable()
export class GetPostByIdUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
  ) {}

  execute = async (id: string): Promise<PostEntity | undefined> => {
    this.loggingService.log('GetPostByIdUseCase.execute');
    const post = await this.postRepository.getPostById(id);
    if (!post) return;

    return post;
  };
}
