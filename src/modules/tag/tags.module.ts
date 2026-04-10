import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// --- Imports de l'Infrastructure ---
import { SQLiteTagEntity } from './infrastructure/entities/tag.sqlite.entity';
import { SQLiteTagRepository } from './infrastructure/repositories/tag.sqlite.repository';
import { TagsController } from './infrastructure/controllers/tags.controller';

// --- Imports de l'Application ---
import { CreateTagUseCase } from './application/use-cases/create-tag.use-case';
import { GetTagsUseCase } from './application/use-cases/get-tags.use-case';
import { DeleteTagUseCase } from './application/use-cases/delete-tag.use-case';
import { UpdateTagUseCase } from './application/use-cases/update-tag.use-case';

// --- Imports du Domaine ---
import { TagRepository } from '../tag/repositories/tag.repository';

@Module({
  imports: [
    // On déclare l'entité TypeORM à l'échelle de ce module
    // SQLiteTagRepository injecter le Repository natif de TypeORM
    TypeOrmModule.forFeature([SQLiteTagEntity]),
  ],
  controllers: [
    // On déclare les points d'entrée HTTP (notre API REST)
    TagsController,
  ],
  providers: [
    // On déclare nos cas d'utilisation pour qu'ils puissent être injectés dans le contrôleur
    CreateTagUseCase,
    GetTagsUseCase,
    UpdateTagUseCase,
    DeleteTagUseCase,
    // Si un constructeur demande 'TagRepository' on lui fournis une instance de 'SQLiteTagRepository'."
    {
      provide: TagRepository,
      useClass: SQLiteTagRepository,
    },
  ],
  exports: [
    // Si d'autres modules (PostsModule) ont besoin d'interagir avec les tags
    // depuis leurs propres Use Cases, on exporte notre Repository.
    TagRepository,
  ],
})
export class TagsModule {}
