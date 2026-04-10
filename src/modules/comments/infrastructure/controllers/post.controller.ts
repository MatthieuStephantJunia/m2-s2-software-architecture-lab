import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../../../modules/shared/auth/infrastructure/guards/jwt-auth.guard';
import { Public } from '../../../../modules/shared/auth/infrastructure/guards/public.decorator';
import { Requester } from '../../../../modules/shared/auth/infrastructure/decorators/requester.decorator';
import { UserEntity } from '../../../../modules/users/domain/entities/user.entity';

import { AddCommentUseCase } from '../../applicaiton/use-cases/add-comment.use-case';
import { GetPostCommentsUseCase } from '../../applicaiton/use-cases/get-post-comments.use-case';
import { DeleteCommentUseCase } from '../../applicaiton/use-cases/delete-comment.use-case';
import { UpdateCommentUseCase } from '../../applicaiton/use-cases/update-comment.use-case';

@Controller('posts')
export class CommentController {
  constructor(
    private readonly addCommentUseCase: AddCommentUseCase,
    private readonly getPostCommentsUseCase: GetPostCommentsUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
  ) {}

  @Post(':postId/comments')
  @ApiBearerAuth()
  @ApiBody({
    description: 'Contenu du commentaire',
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: 'Merci pour cet article, il est tres clair.',
          default: 'Merci pour cet article, il est tres clair.',
        },
      },
      required: ['content'],
    },
  })
  @UseGuards(JwtAuthGuard)
  public async addComment(
    @Param('postId') postId: string,
    @Body('content') content: string,
    @Requester() user: UserEntity,
  ) {
    const comment = await this.addCommentUseCase.execute(
      postId,
      user.id,
      content,
    );
    return comment.toJSON();
  }

  @Get(':postId/comments')
  @Public()
  public async getPostComments(@Param('postId') postId: string) {
    const comments = await this.getPostCommentsUseCase.execute(postId);
    return comments.map((c) => c.toJSON());
  }

  @Delete(':postId/comments/:commentId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async deleteComment(
    @Param('commentId') commentId: string,
    @Requester() user: UserEntity,
  ) {
    await this.deleteCommentUseCase.execute(commentId, user.id, user.getRole());
  }

  @Patch(':postId/comments/:commentId')
  @ApiBearerAuth()
  @ApiBody({
    description: 'Nouveau contenu du commentaire',
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: 'Je mets a jour mon commentaire avec plus de details.',
          default: 'Je mets a jour mon commentaire avec plus de details.',
        },
      },
      required: ['content'],
    },
  })
  @UseGuards(JwtAuthGuard)
  public async updateComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body('content') content: string,
    @Requester() user: UserEntity,
  ) {
    const comment = await this.updateCommentUseCase.execute(
      postId,
      commentId,
      user.id,
      user.getRole(),
      content,
    );

    return comment.toJSON();
  }
}
