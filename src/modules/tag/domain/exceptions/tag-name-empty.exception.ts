import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class TagNameEmptyException extends DomainException {
  constructor() {
    super('Le nom du tag ne peut pas être vide.', 'TAG_NAME_EMPTY');
  }
}
