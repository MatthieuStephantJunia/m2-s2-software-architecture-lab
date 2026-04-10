import { InvalidCommentContentException } from '../exceptions/invalid-comment-content.exception';

export class CommentContent {
  private readonly value: string;

  constructor(content: string) {
    // 1. Nettoyage (Sanitization)
    const sanitizedContent = this.sanitize(content);

    // 2. Validation (Business Rules)
    this.validate(sanitizedContent);

    // 3. Assignation
    this.value = sanitizedContent;
  }

  /**
   * Nettoie la chaîne de caractères avant validation.
   * On enlève les espaces au début et à la fin, et on empêche
   * l'utilisateur de spammer la touche "Espace" ou "Entrée".
   */
  private sanitize(content: string | undefined | null): string {
    if (!content) return '';
    return content
      .trim() // Enlève les espaces aux extrémités
      .replace(/\s+/g, ' '); // Remplace les espaces/sauts de ligne multiples par un seul espace
  }

  /**
   * Vérifie que le contenu respecte les règles métier (Product Contract).
   * Si ce n'est pas le cas, on lève une erreur explicite.
   */
  private validate(content: string): void {
    if (content.length === 0) {
      throw new InvalidCommentContentException(
        'Le commentaire ne peut pas etre vide.',
      );
    }
    if (content.length < 2) {
      throw new InvalidCommentContentException(
        'Le commentaire doit contenir au moins 2 caracteres pertinents.',
      );
    }

    if (content.length > 1000) {
      throw new InvalidCommentContentException(
        `Le commentaire est trop long (${content.length}/1000 caracteres maximum).`,
      );
    }
  }

  //Getter de la valeur primitive

  public getValue(): string {
    return this.value;
  }
}
