export class PostSlug {
  private readonly value: string;

  constructor(slug: string) {
    if (slug === undefined || slug === null || typeof slug !== 'string') {
      throw new Error(
        'Le slug doit être fourni et doit être une chaîne de caractères.',
      );
    }
    const trimmedSlug = slug.trim();
    this.validate(trimmedSlug);
    this.value = trimmedSlug;
  }
  // Méthode de création explicite
  public static create(slug: string | null): PostSlug | null {
    if (slug === null) {
      return null;
    }
    return new PostSlug(slug);
  }

  // Règles de validation (Product Contract)
  private validate(slug: string): void {
    if (!slug || slug.length === 0) {
      throw new Error(
        'Le slug ne peut pas être vide après suppression des caractères invalides.',
      );
    }
    if (slug.length < 3 || slug.length > 100) {
      throw new Error('Le slug doit faire entre 3 et 100 caractères.');
    }
    if (slug !== slug.toLowerCase()) {
      throw new Error('Le slug doit être entièrement en minuscules.');
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      throw new Error(
        'Le slug ne doit contenir que des lettres (a-z), des chiffres (0-9) et des tirets (-).',
      );
    }
    if (slug.startsWith('-') || slug.endsWith('-')) {
      throw new Error(
        'Le slug ne doit pas commencer ni se terminer par un tiret.',
      );
    }
  }

  public getValue(): string {
    return this.value;
  }

  //Factory method : Logique de création à partir d'un titre

  public static createFromTitle(title: string): PostSlug {
    // 1. Convertir en minuscules
    let generated = title.toLowerCase();

    // 2. Remplacer les espaces et caractères non alphanumériques par des tirets
    generated = generated.replace(/[^a-z0-9]+/g, '-');

    // 3. Supprimer les tirets consécutifs (ex: "hello---world" -> "hello-world")
    generated = generated.replace(/-+/g, '-');

    // 4. Supprimer les tirets au début et à la fin
    generated = generated.replace(/^-+|-+$/g, '');

    // 5. Tronquer à 100 caractères maximum
    if (generated.length > 100) {
      generated = generated.substring(0, 100);
      // Re-nettoyer la fin au cas où la troncature couperait sur un tiret
      generated = generated.replace(/-+$/g, '');
    }

    // 6. Gérer les cas limites (Edge Cases) où le titre ne contient que des caractères spéciaux
    if (generated.length < 3) {
      throw new Error(
        'Impossible de générer un slug valide à partir de ce titre. Veuillez fournir un slug manuellement.',
      );
    }

    return new PostSlug(generated);
  }
}
