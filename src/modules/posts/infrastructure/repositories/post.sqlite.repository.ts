import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PostEntity, PostStatus } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { SQLitePostEntity } from '../entities/post.sqlite.entity';
import { TagEntity } from '../../../tag/entities/tag.entity';
import { TagName } from '../../../tag/value-objects/tag-name';
import { SQLiteTagEntity } from '../../../tag/infrastructure/entities/tag.sqlite.entity';

@Injectable()
export class SQLitePostRepository implements PostRepository {
  constructor(private readonly dataSource: DataSource) {}
  public async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.dataSource
      .getRepository(SQLitePostEntity)
      .count({ where: { slug } });
    return count > 0;
  }

  public async getPosts(): Promise<PostEntity[]> {
    const data = await this.dataSource
      .getRepository(SQLitePostEntity)
      .find({ relations: ['tags'] });

    return data.map((post) => this.toDomain(post));
  }

  public async getPostById(id: string): Promise<PostEntity | undefined> {
    const post = await this.dataSource
      .getRepository(SQLitePostEntity)
      .findOne({ where: { id }, relations: ['tags'] });

    return post ? this.toDomain(post) : undefined;
  }

  public async createPost(input: PostEntity): Promise<void> {
    await this.dataSource.getRepository(SQLitePostEntity).save(input.toJSON());
  }

  public async updatePost(id: string, input: PostEntity): Promise<void> {
    const repo = this.dataSource.getRepository(SQLitePostEntity);

    // On charge l'entité TypeORM existante AVEC ses relations
    const sqlitePost = await repo.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!sqlitePost) {
      throw new Error(
        `Impossible de mettre à jour : le post ${id} n'existe pas en base.`,
      );
    }

    // On met à jour les données simples (titre, contenu, etc.)
    const postData = input.toJSON();
    sqlitePost.title = postData.title as string;
    sqlitePost.content = postData.content as string;
    sqlitePost.status = postData.status as PostStatus;
    sqlitePost.authorId = postData.authorId as string;
    if (input.slug) {
      sqlitePost.slug = input.slug.getValue();
    }

    // On met à jour la liste des tags avec de vrais objets SQLiteTagEntity partiels
    const domainTags = input.getTags();
    if (domainTags && domainTags.length > 0) {
      sqlitePost.tags = domainTags.map((tag) => {
        const sqliteTag = new SQLiteTagEntity();
        sqliteTag.id = tag.getId();
        // TypeORM n'a besoin que de l'ID pour faire le lien dans la table post_tags
        return sqliteTag;
      });
    } else {
      sqlitePost.tags = []; // Vide la relation si on a retiré tous les tags
    }

    // On sauvegarde la VRAIE instance TypeORM (sqlitePost),
    // TypeORM détecte les changements dans sqlitePost.tags
    await repo.save(sqlitePost);
  }

  public async deletePost(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLitePostEntity).delete(id);
  }

  async findById(id: string): Promise<PostEntity | null> {
    const sqlitePost = await this.dataSource
      .getRepository(SQLitePostEntity)
      .findOne({
        where: { id },
        relations: ['tags'], // Indique à TypeORM de charger la table de jointure
      });

    if (!sqlitePost) return null;
    return this.toDomain(sqlitePost);
  }

  private toDomain(sqlitePost: SQLitePostEntity): PostEntity {
    // 1. On traduit le tableau de tags de l'Infrastructure vers le Domaine
    // (sqlitePost.tags || []) évite les erreurs si TypeORM renvoie undefined
    const domainTags: TagEntity[] = (sqlitePost.tags || []).map((sqliteTag) => {
      const tagName = TagName.create(sqliteTag.name);
      return TagEntity.reconstitute(sqliteTag.id, tagName, sqliteTag.createdAt);
    });

    // 2. On reconstitue le Post avec ses autres champs et le tableau de tags
    return PostEntity.reconstitute({
      ...sqlitePost,
      slug: sqlitePost.slug,
      tags: domainTags,
    });
  }

  async save(post: PostEntity): Promise<void> {
    // Création TypeORM
    const sqlitePost = new SQLitePostEntity();

    // On mappe les propriétés simples
    sqlitePost.id = post.id;
    sqlitePost.title = post.title;
    sqlitePost.content = post.content;
    sqlitePost.status = post.status;
    sqlitePost.authorId = post.authorId;
    sqlitePost.createdAt = post.getCreatedAt();
    // TODO [ a faire ] : gérer le slug
    if (post.slug) {
      sqlitePost.slug = post.slug.getValue();
    }

    // On mappe la relation complexe de manière à ce que TypeORM la comprenne
    const domainTags = post.getTags() ?? [];
    if (domainTags.length > 0) {
      sqlitePost.tags = domainTags.map((tag: TagEntity) => {
        const sqliteTag = new SQLiteTagEntity();
        sqliteTag.id = tag.getId();
        sqliteTag.name = tag.getName().getValue();
        // On ne met que les IDs/entités recréées,
        return sqliteTag;
      });
    } else {
      sqlitePost.tags = [];
    }
    /*console.log('--- 3. REPOSITORY ---');
    console.log('Objet prêt pour SQLite :', sqlitePost);*/
    // On utilise le repository injecté nativement par NestJS
    console.log('Tags à sauvegarder :', sqlitePost.tags.length);
    await this.dataSource.getRepository(SQLitePostEntity).save(sqlitePost);
  }

  public async getPostBySlug(slug: string): Promise<PostEntity | undefined> {
    const sqlitePost = await this.dataSource
      .getRepository(SQLitePostEntity)
      .findOne({
        where: { slug },
        relations: ['tags'], // On garde les relations comme pour le getPostById
      });

    return sqlitePost ? this.toDomain(sqlitePost) : undefined;
  }
}
