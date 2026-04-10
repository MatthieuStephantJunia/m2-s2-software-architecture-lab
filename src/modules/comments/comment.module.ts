import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entité ORM
import { SQLiteCommentEntity } from './infrastructure/entities/comment.sqlite.entity';

// Repositories
import { CommentRepository } from './domain/repositories/comment.repository';
import { SQLiteCommentRepository } from './infrastructure/repositories/comment.sqlite.repository';

// Use Cases

import { AddCommentUseCase } from './applicaiton/use-cases/add-comment.use-case';
import { GetPostCommentsUseCase } from './applicaiton/use-cases/get-post-comments.use-case';
import { DeleteCommentUseCase } from './applicaiton/use-cases/delete-comment.use-case';
import { UpdateCommentUseCase } from './applicaiton/use-cases/update-comment.use-case';

import { PostModule } from '../posts/post.module';
import { CommentController } from './infrastructure/controllers/post.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SQLiteCommentEntity]), // Déclare l'entité TypeORM
    PostModule, // Permet d'injecter PostRepository
  ],
  controllers: [CommentController],
  providers: [
    // L'injection de dépendance pour le Repository
    {
      provide: CommentRepository,
      useClass: SQLiteCommentRepository,
    },
    // Déclaration des Use Cases
    AddCommentUseCase,
    GetPostCommentsUseCase,
    DeleteCommentUseCase,
    UpdateCommentUseCase,
  ],
  exports: [
    AddCommentUseCase,
    GetPostCommentsUseCase,
    DeleteCommentUseCase,
    UpdateCommentUseCase,
  ],
})
export class CommentModule {}
