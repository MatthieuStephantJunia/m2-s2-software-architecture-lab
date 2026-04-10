import { DomainException } from '../../shared/errors/domain/exceptions/domain.exception';

export class TagNameFormatInvalidException extends DomainException {
  constructor() {
    super(
      'Le nom du tag ne peut contenir que des lettres minuscules, des chiffres et des tirets.',
      'TAG_NAME_FORMAT_INVALID',
    );
  }
}
