import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../../../modules/tag/repositories/tag.repository';
import { TagEntity } from '../../../tag/entities/tag.entity';
import { TagName } from '../../../../modules/tag/value-objects/tag-name';
import { randomUUID } from 'crypto';
import { TagAlreadyExistsException } from '../../../tag/exceptions/tag-already-exists.exception';

// On définit une interface pour les données d'entrée (Command)
export interface CreateTagCommand {
  name: string;
}

@Injectable()
export class CreateTagUseCase {
  // NestJS injecte l'implémentation du Repository ici
  constructor(private readonly tagRepository: TagRepository) {}

  //On execute le Use Case pour créer un nouveau tag.

  execute = async (command: CreateTagCommand): Promise<TagEntity> => {
    // On créer et valider le Value Object
    // Erreur  levée ici si non invalide
    const tagName = TagName.create(command.name);

    // On vérifie la règle métier d'unicité
    // Interogation via notre la classe abstraite Repository
    const existingTag = await this.tagRepository.findByName(tagName);

    if (existingTag) {
      // RM: Un tag avec ce nom existe déjà, on ne peut pas en créer un autre avec le même nom
      // On préfére lever une erreur de domaine  plutôt qu'une erreur HTTP
      // Global Exception Filter -> 409 ou 400.
      throw new TagAlreadyExistsException(tagName.getValue());
    }

    // On crée un UUID
    const tagId = randomUUID();

    // On crée la nouvelle entité
    const newTag = TagEntity.create(tagId, tagName);

    // Sauvgarde en base de données
    await this.tagRepository.save(newTag);

    return newTag;
  };
}
