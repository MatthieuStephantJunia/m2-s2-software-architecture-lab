import { Injectable } from '@nestjs/common';

import { TagRepository } from '../../repositories/tag.repository';
import { TagEntity } from '../../entities/tag.entity';
import { TagName } from '../../value-objects/tag-name';

export interface UpdateTagCommand {
  id: string;
  name: string;
}

@Injectable()
export class UpdateTagUseCase {
  constructor(private readonly tagRepository: TagRepository) {}

  execute = async (command: UpdateTagCommand): Promise<TagEntity> => {
    // 1. On vérifie que le tag à modifier existe bien
    const tagToUpdate = await this.tagRepository.findById(command.id);
    if (!tagToUpdate) {
      throw new Error(`Le tag avec l'ID '${command.id}' est introuvable.`);
    }

    // 2. On instancie le nouveau Value Object (valide les règles de format)
    const newTagName = TagName.create(command.name);

    // 3. On vérifie si on essaie réellement de changer le nom
    // (Si on envoie le même nom, on peut éviter de faire une requête en base)
    if (tagToUpdate.getName().equals(newTagName)) {
      return tagToUpdate;
    }

    // 4. On vérifie que le nouveau nom n'est pas déjà pris par un AUTRE tag
    const tagWithSameName = await this.tagRepository.findByName(newTagName);
    if (tagWithSameName && tagWithSameName.getId() !== command.id) {
      throw new Error(
        `Le nom de tag '${newTagName.getValue()}' est déjà utilisé.`,
      );
    }

    // 5. On met à jour l'entité du domaine
    tagToUpdate.updateName(newTagName);

    // 6. On sauvegarde les modifications
    await this.tagRepository.save(tagToUpdate);

    return tagToUpdate;
  };
}
