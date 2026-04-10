import { TagNameEmptyException } from '../exceptions/tag-name-empty.exception';
import { TagNameLengthInvalidException } from '../exceptions/tag-name-length-invalid.exception';
import { TagNameFormatInvalidException } from '../exceptions/tag-name-format-invalid.exception';

export class TagName {
  // La valeur est "readonly" pour garantir l'immuabilité (elle ne changera jamais)
  private readonly value: string;

  // Le constructeur est privé : on force l'utilisation de la méthode statique 'create'
  private constructor(value: string) {
    this.value = value;
  }

  // La méthode de fabrique (Factory Method) qui valide les règles métier
  public static create(value: string): TagName {
    if (!value || value.trim().length === 0) {
      throw new TagNameEmptyException();
    }

    // On applique la règle métier : forcer en minuscules
    const formattedValue = value.trim().toLowerCase();

    // Règle métier : Doit faire entre 2 et 50 caractères
    if (formattedValue.length < 2 || formattedValue.length > 50) {
      throw new TagNameLengthInvalidException();
    }

    // Règle métier : Doit être alphanumérique avec des tirets autorisés
    const regex = /^[a-z0-9-]+$/;
    if (!regex.test(formattedValue)) {
      throw new TagNameFormatInvalidException();
    }

    // Si toutes les règles sont respectées, on instancie l'objet
    return new TagName(formattedValue);
  }

  // Permet de récupérer la valeur primitive (utile pour la base de données)
  public getValue(): string {
    return this.value;
  }

  // Dans un Value Object, l'égalité se vérifie par la valeur, pas par la référence mémoire
  public equals(other: TagName): boolean {
    if (!(other instanceof TagName)) {
      return false;
    }
    return this.value === other.getValue();
  }
}
