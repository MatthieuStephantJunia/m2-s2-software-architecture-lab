import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class UserCannotUpdatePostException extends DomainException {
  constructor() {
    super(
      'You do not have permission to update this post',
      'USER_CANNOT_UPDATE_POST',
    );
  }
}
