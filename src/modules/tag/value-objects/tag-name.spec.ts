import { TagName } from './tag-name';
import { TagNameEmptyException } from '../exceptions/tag-name-empty.exception';
import { TagNameLengthInvalidException } from '../exceptions/tag-name-length-invalid.exception';
import { TagNameFormatInvalidException } from '../exceptions/tag-name-format-invalid.exception';

describe('TagName Value Object', () => {
  describe('create()', () => {
    it('devrait créer un TagName valide (avec mise en minuscules et suppression des espaces)', () => {
      // Act
      const tag = TagName.create('  JavaScript-2026  '); // TagName a corriger

      // Assert
      expect(tag.getValue()).toBe('javascript-2026'); // TagName corriger
    });

    it('devrait lever une erreur si la valeur est vide ou ne contient que des espaces', () => {
      // Assert
      expect(() => TagName.create('')).toThrow(TagNameEmptyException);
      expect(() => TagName.create('   ')).toThrow(TagNameEmptyException);
    });

    it('devrait lever une erreur si la valeur fait moins de 2 caractères', () => {
      // Assert
      expect(() => TagName.create('a')).toThrow(TagNameLengthInvalidException);
    });

    it('devrait lever une erreur si la valeur fait plus de 50 caractères', () => {
      // Arrange
      const tooLongName = 'a'.repeat(51);

      // Assert
      expect(() => TagName.create(tooLongName)).toThrow(
        TagNameLengthInvalidException,
      );
    });

    it('devrait lever une erreur si la valeur contient des caractères non autorisés', () => {
      // Assert
      expect(() => TagName.create('tag@invalide!')).toThrow(
        TagNameFormatInvalidException,
      );
      expect(() => TagName.create('mon_tag')).toThrow(
        TagNameFormatInvalidException,
      ); // On ne teste que 2 cas de caractères interdits
    });
  });

  describe('equals()', () => {
    it('devrait retourner true pour deux TagName ayant la même valeur', () => {
      // Arrange
      const tag1 = TagName.create('nodejs');
      const tag2 = TagName.create('NodeJS'); // Devrait être transformé en 'nodejs'

      // Act & Assert
      expect(tag1.equals(tag2)).toBe(true);
    });

    it('devrait retourner false pour deux TagName ayant des valeurs différentes', () => {
      // Arrange
      const tag1 = TagName.create('nodejs');
      const tag2 = TagName.create('typescript');

      // Act & Assert
      expect(tag1.equals(tag2)).toBe(false);
    });

    it('devrait retourner false si comparé à un autre type dobjet ou à null', () => {
      // Arrange
      const tag = TagName.create('nodejs');
      const fakeTag = { getValue: () => 'nodejs' };

      // Act & Assert
      // On cast en "any" pour contourner temporairement TypeScript et simuler une erreur au runtime
      expect(tag.equals(fakeTag as unknown as TagName)).toBe(false);
      expect(tag.equals(null as unknown as TagName)).toBe(false);
    });
  });
});
