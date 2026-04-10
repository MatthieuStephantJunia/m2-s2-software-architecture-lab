import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('tags') // Nom de la table dans la base de données
export class SQLiteTagEntity {
  // PrimaryColumn car l'ID (UUID) est généré par notre Use Case
  @PrimaryColumn('uuid')
  id: string;

  // Contrainte d'unicité directement au niveau de la base de données
  // Double sécurité, comme dans le Use Case
  @Column({ unique: true })
  name: string;

  @Column()
  createdAt: Date;
}

// TODO [ A faire ] : ajouter les décorateurs @ManyToMany et @JoinTable de TypeORM)
