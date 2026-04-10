import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class InvalidCommentContentException extends DomainException {
  constructor(message: string) {
    super(message, 'INVALID_COMMENT_CONTENT');
  }
}