import { TagEntity } from '../entities/tag.entity';
import { TagName } from '../value-objects/tag-name';

export abstract class TagRepository {
  // On sauvegarde un nouveau tag ( ou met à jour un tag existant )

  abstract save(tag: TagEntity): Promise<void>;

  // On récupère un tag via son id, Retourne null si il n'existe pas
  abstract findById(id: string): Promise<TagEntity | null>;

  // On récupère un tag via son nom (Value Object) ( attention : règle d'unicité).
  abstract findByName(name: TagName): Promise<TagEntity | null>;

  //Récupère la liste de tous les tags.
  abstract findAll(): Promise<TagEntity[]>;

  //Supprime un tag via son identifiant.
  abstract delete(id: string): Promise<void>;
}
