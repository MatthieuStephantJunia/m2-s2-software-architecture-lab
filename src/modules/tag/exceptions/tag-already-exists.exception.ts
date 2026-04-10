import { DomainException } from '../../shared/errors/domain/exceptions/domain.exception';

export class TagAlreadyExistsException extends DomainException {
  constructor(name: string) {
    super(`Le tag '${name}' existe déjà.`, 'TAG_ALREADY_EXISTS');
  }
}