import { PostContent } from '../value-objects/post-content.value-object';
import { PostTitle } from '../value-objects/post-title.value-object';
import { TagEntity } from '../../../tag/entities/tag.entity';
import { PostSlug } from '../value-objects/post-slug';

export type PostStatus = 'draft' | 'waiting' | 'accepted' | 'rejected';

export class PostEntity {
  private _title: PostTitle;
  private _content: PostContent;
  private _authorId: string;
  private _status: PostStatus;
  private _tags: TagEntity[];
  private _slug: PostSlug | null;
  private readonly createdAt: Date;

  private constructor(
    readonly id: string,
    title: PostTitle,
    content: PostContent,
    authorId: string,
    status: PostStatus,
    tags: TagEntity[],
    createdAt: Date,
    slug: PostSlug | null,
  ) {
    this.id = id;
    this._title = title;
    this._content = content;
    this._authorId = authorId;
    this._slug = slug;
    this._status = status;
    this._tags = tags || [];
    this.createdAt = createdAt;
  }

  public get status() {
    return this._status;
  }

  public get authorId() {
    return this._authorId;
  }

  public get title(): string {
    return this._title.toString();
  }

  public get content(): string {
    return this._content.toString();
  }

  public getId(): string {
    return this.id;
  }
  public getTitle(): string {
    return this._title.toString();
  }
  public getContent(): string {
    return this._content.toString();
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getTags(): TagEntity[] {
    return [...this._tags];
  }

  public static reconstitute(input: Record<string, unknown>) {
    const slugValue = input.slug as string | null | undefined;
    return new PostEntity(
      input.id as string,
      new PostTitle(input.title as string),
      new PostContent(input.content as string),
      input.authorId as string,
      input.status as PostStatus,
      (input.tags as TagEntity[]) || [],
      input.createdAt as Date,
      slugValue ? new PostSlug(slugValue) : null,
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      title: this._title.toString(),
      content: this._content.toString(),
      status: this._status,
      authorId: this._authorId,
      tags: this._tags.map((tag) => ({
        id: tag.getId(),
        name: tag.getName().getValue(),
      })),
      slug: this._slug ? this._slug.getValue() : null,
    };
  }

  public static create(
    id: string,
    title: string,
    content: string,
    authorId: string,
    slug: string,
  ): PostEntity {
    // Lors d'une création, le statut par défaut est DRAFT (demande métier)
    // On génère la date du jour, et on initialise un tableau de tags vide
    return new PostEntity(
      id,
      new PostTitle(title),
      new PostContent(content),
      authorId,
      'draft',
      [],
      new Date(),
      new PostSlug(slug),
    );
  }

  public update(title?: string, content?: string) {
    if (title) {
      this._title = new PostTitle(title);
    }

    if (content) {
      this._content = new PostContent(content);
    }
  }

  public addTag(tag: TagEntity): void {
    // Règle métier : On évite les doublons
    const alreadyExists = this._tags.some((t) => t.getId() === tag.getId());
    if (!alreadyExists) {
      this._tags.push(tag);
    }
  }

  public removeTag(tagId: string): void {
    this._tags = this._tags.filter((t) => t.getId() !== tagId);
  }

  public updateSlug(newSlug: PostSlug): void {
    // La validation gérer Value Object PostSlug !
    this._slug = newSlug;
    // Maj de la date de modification si on veux en ajouter une
  }

  // Getter du slug
  get slug(): PostSlug | null {
    return this._slug;
  }
}
