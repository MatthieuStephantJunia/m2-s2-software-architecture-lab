import { Injectable } from '@nestjs/common';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';

@Injectable()
export class InMemoryPostRepository implements PostRepository {
  private posts: Record<string, unknown>[] = [];
  public save(post: PostEntity): Promise<void> {
    const index = this.posts.findIndex((p) => p.id === post.toJSON().id);
    if (index !== -1) {
      this.posts[index] = post.toJSON();
    } else {
      this.posts.push(post.toJSON());
    }
    return Promise.resolve();
  }

  public getPosts(): PostEntity[] {
    console.log('InMemoryPostRepository.getPosts');
    return this.posts.map((post) => PostEntity.reconstitute(post));
  }

  public getPostById(id: string) {
    const post = this.posts.find((post) => post.id === id);

    if (post) {
      return PostEntity.reconstitute(post);
    }
  }

  public createPost(input: PostEntity) {
    this.posts.push(input.toJSON());
  }

  public updatePost(id: string, input: PostEntity) {
    this.posts = this.posts.map((post) => {
      if (post.id !== id) {
        return post;
      }

      return input.toJSON();
    });
  }

  public deletePost(id: string) {
    this.posts = this.posts.filter((post) => post.id !== id);
  }

  findById(id: string): Promise<PostEntity | null> {
    // On cherche dans le tableau en mémoire 'posts' (ou le nom donné dans ton fichier)
    // l'article dont l'ID correspond.
    const post = this.posts.find((p) => p.id === id);
    // Si on le trouve on le retourne, sinon on retourne null
    return Promise.resolve(post ? PostEntity.reconstitute(post) : null);
  }

  public async getPostBySlug(slug: string): Promise<PostEntity | undefined> {
    // On cherche dans le tableau en mémoire
    const post = await Promise.resolve(
      this.posts.find((p) => 'slug' in p && p.slug === slug),
    );
    return post ? PostEntity.reconstitute(post) : undefined;
  }

  public async existsBySlug(slug: string): Promise<boolean> {
    return await Promise.resolve(
      this.posts.some((p) => 'slug' in p && p.slug === slug),
    );
  }
}
