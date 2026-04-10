import { Column, Entity, PrimaryColumn } from 'typeorm';
import { type UserRole } from '../../domain/entities/user.entity';
import * as postEntity from '../../../posts/domain/entities/post.entity';

@Entity('users')
export class SQLiteUserEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'varchar' }) // Pour TypeORM, typechaîne de caractères
  role!: UserRole;

  @Column()
  password!: string;

  @Column({ type: 'varchar', default: () => "'DRAFT'" })
  status!: postEntity.PostStatus;
}
