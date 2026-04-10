import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { CommentContent } from '../../domain/value-objects/comment-content';
import { SQLiteCommentEntity } from '../entities/comment.sqlite.entity';

@Injectable()
export class SQLiteCommentRepository implements CommentRepository {
  constructor(private readonly dataSource: DataSource) {}

  private toDomain(sqliteComment: SQLiteCommentEntity): CommentEntity {
    // On recrée le Value Object
    const content = new CommentContent(sqliteComment.content);

    // On reconstitue l'entité métier
    return CommentEntity.reconstitute({
      id: sqliteComment.id,
      content: content,
      authorId: sqliteComment.authorId,
      postId: sqliteComment.postId,
      createdAt: sqliteComment.createdAt,
      updatedAt: sqliteComment.updatedAt,
    });
  }

  public async save(comment: CommentEntity): Promise<void> {
    const sqliteComment = new SQLiteCommentEntity();

    // On prépare l'entité métier pour la BDD
    sqliteComment.id = comment.id;
    sqliteComment.content = comment.content.getValue(); // On extrait la string du Value Object
    sqliteComment.authorId = comment.authorId;
    sqliteComment.postId = comment.postId;
    sqliteComment.createdAt = comment.createdAt;

    if (comment.updatedAt) {
      sqliteComment.updatedAt = comment.updatedAt;
    }

    await this.dataSource
      .getRepository(SQLiteCommentEntity)
      .save(sqliteComment);
  }

  public async findByPostId(postId: string): Promise<CommentEntity[]> {
    const sqliteComments = await this.dataSource
      .getRepository(SQLiteCommentEntity)
      // On récupère les commentaires et on les trie par date de création (les plus anciens d'abord)
      .find({
        where: { postId },
        order: { createdAt: 'ASC' },
      });

    // On transforme le tableau d'entités SQLite en tableau d'entités de Domaine
    return sqliteComments.map((c) => this.toDomain(c));
  }

  public async findById(id: string): Promise<CommentEntity | null> {
    const sqliteComment = await this.dataSource
      .getRepository(SQLiteCommentEntity)
      .findOne({ where: { id } });

    if (!sqliteComment) {
      return null;
    }

    return this.toDomain(sqliteComment);
  }

  public async delete(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLiteCommentEntity).delete(id);
  }
}
