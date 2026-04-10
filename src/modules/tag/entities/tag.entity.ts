import { TagName } from '../value-objects/tag-name';

export class TagEntity {
  private readonly id: string;
  private name: TagName;
  private readonly createdAt: Date;

  // Constructeur privé pour forcer l'utilisation des méthodes statiques (Factories)
  private constructor(id: string, name: TagName, createdAt: Date) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
  }

  /**
   * Factory method pour créer un NOUVEAU tag (ex: via le contrôleur HTTP).
   * La date de création est générée automatiquement.
   */
  public static create(id: string, name: TagName): TagEntity {
    return new TagEntity(id, name, new Date());
  }

  /**
   * Factory method pour RECONSTITUER un tag existant
   * (ex: quand on le récupère depuis la base de données SQLite).
   */
  public static reconstitute(
    id: string,
    name: TagName,
    createdAt: Date,
  ): TagEntity {
    return new TagEntity(id, name, createdAt);
  }

  // GETTERS
  // On n'expose que ce qui est nécessaire

  public getId(): string {
    return this.id;
  }

  public getName(): TagName {
    return this.name;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  // --- LOGIQUE MÉTIER ---

  /**
   * Permet de mettre à jour le nom du tag. On passe un objet TagName, donc le nouveau nom
   * a déjà passé toutes les validations (longueur, caractères, etc.).
   */
  public updateName(newName: TagName): void {
    this.name = newName;
  }
}
