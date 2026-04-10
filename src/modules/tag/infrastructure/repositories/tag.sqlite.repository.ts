import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SQLiteTagEntity } from '../entities/tag.sqlite.entity';

import { TagRepository } from '../../../tag/repositories/tag.repository';
import { TagEntity } from '../../../tag/entities/tag.entity';
import { TagName } from '../../../tag/value-objects/tag-name';

@Injectable()
export class SQLiteTagRepository implements TagRepository {
  // On demande à NestJS d'injecter le Repository natif de TypeORM lié à notre entité SQLite
  constructor(
    @InjectRepository(SQLiteTagEntity)
    private readonly typeOrmRepository: Repository<SQLiteTagEntity>,
  ) {}

  // Sauvegarde un TagEntity (Domaine) dans la base de données SQLite

  async save(tag: TagEntity): Promise<void> {
    // On "mappe" (convertit) l'entité du Domaine vers l'entité de la base de données
    const sqliteTag = new SQLiteTagEntity();
    sqliteTag.id = tag.getId();
    sqliteTag.name = tag.getName().getValue();
    sqliteTag.createdAt = tag.getCreatedAt();

    // On utilise TypeORM pour sauvegarder
    await this.typeOrmRepository.save(sqliteTag);
  }

  // On récupère un Tag via son ID

  async findById(id: string): Promise<TagEntity | null> {
    const sqliteTag = await this.typeOrmRepository.findOne({ where: { id } });

    if (!sqliteTag) {
      return null;
    }

    // On reconvertit le résultat SQLite en une vraie Entité métier
    return this.toDomain(sqliteTag);
  }

  // Récupère un Tag via son nom (utilise le Value Object en paramètre)
  async findByName(name: TagName): Promise<TagEntity | null> {
    const sqliteTag = await this.typeOrmRepository.findOne({
      where: { name: name.getValue() },
    });

    if (!sqliteTag) {
      return null;
    }

    return this.toDomain(sqliteTag);
  }

  // Récupère tous les Tags
  async findAll(): Promise<TagEntity[]> {
    const sqliteTags = await this.typeOrmRepository.find();

    // On convertit tout le tableau retourné par TypeORM
    return sqliteTags.map((tag) => this.toDomain(tag));
  }

  // Supprime un Tag via son ID
  async delete(id: string): Promise<void> {
    await this.typeOrmRepository.delete(id);
  }

  /**
   * Méthode utilitaire privée (Mapper)
   * Transforme un objet "bête" venant de la base de données (SQLiteTagEntity)
   * en un objet "intelligent" de notre cœur métier (TagEntity).
   */
  private toDomain(sqliteTag: SQLiteTagEntity): TagEntity {
    // On recrée le Value Object (ce qui garantit que la donnée lue en base est toujours valide)
    const tagName = TagName.create(sqliteTag.name);

    // On utilise la méthode 'reconstitute' car ce n'est pas un nouveau tag,
    // mais un tag qui existait déjà dans le passé.
    return TagEntity.reconstitute(sqliteTag.id, tagName, sqliteTag.createdAt);
  }
}
