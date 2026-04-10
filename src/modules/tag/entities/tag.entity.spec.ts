import { TagEntity } from './tag.entity';
import { TagName } from '../value-objects/tag-name';

describe('TagEntity', () => {
  // On prépare des variables générique
  const validId = 'uuid-1234';
  let validTagName: TagName;

  beforeEach(() => {
    // On crée un nouveau Value Object valide
    validTagName = TagName.create('javascript');
  });

  describe('create()', () => {
    it('devrait créer un nouveau tag avec la date courante', () => {
      const tag = TagEntity.create(validId, validTagName);

      expect(tag.getId()).toBe(validId);
      expect(tag.getName()).toBe(validTagName);
      expect(tag.getName().getValue()).toBe('javascript');

      // On vérifie que la date de création a bien été générée
      const now = new Date();
      expect(tag.getCreatedAt().getTime()).toBeLessThanOrEqual(now.getTime()); // Est elle récente ?
      // On s'assure qu'elle est dans la marge d'erreur de l'exécution
      expect(tag.getCreatedAt().getTime()).toBeGreaterThan(
        now.getTime() - 1000,
      );
    });
  });

  describe('reconstitute()', () => {
    it('devrait reconstituer un tag existant avec une date spécifique', () => {
      // Arrange
      const pastDate = new Date('2023-01-01T10:00:00Z');

      // Act
      const tag = TagEntity.reconstitute(validId, validTagName, pastDate);

      // Assert
      expect(tag.getId()).toBe(validId);
      expect(tag.getName()).toBe(validTagName);
      expect(tag.getCreatedAt()).toBe(pastDate); // La date doit être exactement celle fournie
    });
  });

  describe('updateName()', () => {
    it('devrait mettre à jour le nom du tag', () => {
      // Arrange
      const tag = TagEntity.create(validId, validTagName);
      const newTagName = TagName.create('typescript');

      // Act
      tag.updateName(newTagName);

      // Assert
      expect(tag.getName()).toBe(newTagName);
      expect(tag.getName().getValue()).toBe('typescript');
    });
  });
});
