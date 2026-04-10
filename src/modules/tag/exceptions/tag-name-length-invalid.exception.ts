import { DomainException } from '../../shared/errors/domain/exceptions/domain.exception';

export class TagNameLengthInvalidException extends DomainException {
  constructor() {
    super(
      'Le nom du tag doit contenir entre 2 et 50 caractères.',
      'TAG_NAME_LENGTH_INVALID',
    );
  }
}
