import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostEntity } from '../../domain/entities/post.entity';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { randomUUID } from 'crypto';
import { TagRepository } from '../../../tag/repositories/tag.repository';
import { TagEntity } from '../../../tag/entities/tag.entity';
import { UserCannotCreatePostException } from '../../domain/exceptions/user-cannot-create-post.exception';
import { PostCreatedEvent } from '../../domain/events/post-created.event';
import { PostSlug } from '../../domain/value-objects/post-slug';

export interface CreatePostCommand {
  title: string;
  content: string;
  authorId: string;
  tagIds?: string[];
  slug?: string;
}

@Injectable()
export class CreatePostUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  execute = async (
    command: CreatePostCommand,
    user: UserEntity,
  ): Promise<PostEntity> => {
    /*console.log('--- 2. USE CASE ---');
    console.log('Commande reçue :', command);*/
    if (!user.permissions.posts.canCreate()) {
      throw new UserCannotCreatePostException();
    }

    let baseSlug: PostSlug;

    // 1. Déterminer le slug de base (fourni manuellement ou généré depuis le titre)
    if (command.slug) {
      baseSlug = new PostSlug(command.slug); // Va déclancher une erreur si le format est invalide
    } else {
      baseSlug = PostSlug.createFromTitle(command.title); // Génération automatique
    }

    let finalSlugString = baseSlug.getValue();
    let counter = 2;

    // 2. Boucle pour garantir l'unicité (ex: mon-article, mon-article-2, mon-article-3)
    // Nécessite d'avoir ajouté existsBySlug() dans ton PostRepository !
    while (await this.postRepository.existsBySlug(finalSlugString)) {
      finalSlugString = `${baseSlug.getValue()}-${counter}`;
      counter++;
    }

    // 3. Création du Value Object final une fois l'unicité garantie
    const finalSlug = new PostSlug(finalSlugString);

    command.slug = finalSlug.getValue(); // Optionnel : mettre à jour la commande avec le slug final utilisé

    const post = PostEntity.create(
      randomUUID(),
      command.title,
      command.content,
      command.authorId,
      command.slug,
    );

    if (command.tagIds?.length) {
      const tags = await Promise.all(
        command.tagIds.map((id) => this.tagRepository.findById(id)),
      );

      tags
        .filter((tag): tag is TagEntity => tag !== null)
        .forEach((tag) => post.addTag(tag));
    }
    //console.log("Titre dans l'Entité post-correction :", post.getTitle());
    await this.postRepository.save(post);

    this.eventEmitter.emit(PostCreatedEvent, {
      postId: post.getId(),
      authorId: post.authorId,
    });

    return post;
  };
}
