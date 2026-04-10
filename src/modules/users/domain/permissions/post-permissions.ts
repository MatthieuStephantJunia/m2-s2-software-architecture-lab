import { PostEntity } from '../../../posts/domain/entities/post.entity';
import { UserRole } from '../entities/user.entity';

export class PostPermissions {
  constructor(
    private readonly userId: string,
    private readonly role: UserRole,
  ) {}

  public canCreate(): boolean {
    return this.role === 'writer';
  }

  public canUpdateContent(post: PostEntity): boolean {
    if (post.authorId === this.userId) return true;
    return this.role === 'admin' || this.role === 'moderator';
  }

  public canReadPost(post: PostEntity): boolean {
    if (post.authorId === this.userId) return true;
    if (this.role === 'admin' || this.role === 'moderator') return true;

    return post.status === 'accepted';
  }
}
