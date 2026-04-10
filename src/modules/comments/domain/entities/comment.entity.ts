import { randomUUID } from 'crypto';
import { CommentContent } from '../value-objects/comment-content';

// On définit les propriétés internes de l'entité
export interface CommentProps {
  id: string;
  content: CommentContent;
  authorId: string;
  postId: string;
  createdAt: Date;
  updatedAt?: Date; // Optionnel car n'existe pas à la création
}

export class CommentEntity {
  // Le constructeur est privé pour forcer l'utilisation des méthodes de fabrique (Factory methods)
  private constructor(private readonly props: CommentProps) {}

  /**
   * Factory Method 1 : Utilisée par le Use Case (AddCommentUseCase)
   * pour créer un NOUVEAU commentaire. Elle génère l'ID et la date de création.
   */
  public static create(
    content: CommentContent,
    authorId: string,
    postId: string,
  ): CommentEntity {
    return new CommentEntity({
      id: randomUUID(), // Génère un ID unique (nécessite l'import de 'crypto')
      content: content,
      authorId: authorId,
      postId: postId,
      createdAt: new Date(),
    });
  }

  /**
   * Factory Method 2 : Utilisée par le Repository (Infrastructure)
   * pour RECONSTITUER une entité à partir des données de la base de données.
   */
  public static reconstitute(props: CommentProps): CommentEntity {
    return new CommentEntity(props);
  }

  /**
   * Règle métier : Mettre à jour le contenu d'un commentaire
   */
  public updateContent(newContent: CommentContent): void {
    this.props.content = newContent;
    this.props.updatedAt = new Date();
  }

  // --- Getters ---
  get id(): string {
    return this.props.id;
  }
  get content(): CommentContent {
    return this.props.content;
  }
  get authorId(): string {
    return this.props.authorId;
  }
  get postId(): string {
    return this.props.postId;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  /**
   * Prépare l'objet pour être renvoyé par le contrôleur HTTP (sans exposer la logique interne)
   */
  public toJSON() {
    return {
      id: this.props.id,
      content: this.props.content.getValue(),
      authorId: this.props.authorId,
      postId: this.props.postId,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
