import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class SQLiteCommentEntity {
  @PrimaryColumn('uuid')
  id!: string;

  // Le type 'text' car les com peuvent être longs
  @Column('text')
  content!: string;

  // Clé étrangère logique vers l'utilisateur
  @Column('varchar')
  authorId!: string;

  // Clé étrangère logique vers l'article
  @Column('varchar')
  postId!: string;

  // TypeORM gérera automatiquement cette date
  @CreateDateColumn()
  createdAt!: Date;

  // TypeORM mettra à jour cette date à chaque modification de la ligne
  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
}
