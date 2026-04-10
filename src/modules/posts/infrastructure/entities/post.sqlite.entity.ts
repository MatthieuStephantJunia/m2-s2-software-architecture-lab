import {
  Column,
  Entity,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import type { PostStatus } from '../../domain/entities/post.entity';
import { SQLiteTagEntity } from '../../../tag/infrastructure/entities/tag.sqlite.entity';

@Entity('posts')
export class SQLitePostEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column({ type: 'text' })
  status!: PostStatus;

  @Column()
  authorId!: string;

  // Relation Many-to-Many avec les tags mode unidirectionnelle pour facilité le GET /posts - filter by tags.
  @ManyToMany(() => SQLiteTagEntity, { cascade: true })
  @JoinTable({
    name: 'post_tags', // Le nom de la table de jointure qui sera créée dans SQLite
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags!: SQLiteTagEntity[];
  @Column({ type: 'text', unique: true, nullable: true })
  slug!: string | null;
}
