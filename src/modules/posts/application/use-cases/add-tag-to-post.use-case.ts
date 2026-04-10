import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { TagRepository } from '../../../tag/repositories/tag.repository';
@Injectable()
export class AddTagToPostUseCase {
  // On injecte les deux contrats (Interfaces)
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  //On  Exécute l'ajout d'un tag à un article.
  execute = async (postId: string, tagId: string): Promise<void> => {
    // 1. On récupère le Post
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException(
        `Le post avec l'ID '${postId}' est introuvable.`,
      );
    }

    // 2. On récupère le Tag
    const tag = await this.tagRepository.findById(tagId);
    if (!tag) {
      throw new NotFoundException(
        `Le tag avec l'ID '${tagId}' est introuvable.`,
      );
    }
    /*console.log('--- TEST USE CASE ---');
    console.log('1. Tags avant ajout :', post.getTags()?.length);*/
    // On exécute la règle métier PURE (dans l'entité Post)
    // C'est l'entité PostEntity qui ajoute le tag
    post.addTag(tag);

    /*console.log('2. Tags APRES ajout :', post.getTags()?.length);
    console.log('3. ID du tag à ajouter :', tag.getId());*/
    // On sauvegarde le Post modifié
    // La couche Infrastructure (TypeORM) fait la mise à jour de la table de jointure
    await this.postRepository.updatePost(post.id, post);
  };
}
