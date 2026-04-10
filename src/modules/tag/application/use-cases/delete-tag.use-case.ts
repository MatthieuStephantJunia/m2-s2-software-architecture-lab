import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../repositories/tag.repository';
//\src\modules\tag\repositories\tag.repository.ts

@Injectable()
export class DeleteTagUseCase {
  constructor(private readonly tagRepository: TagRepository) {}

  execute = async (id: string): Promise<void> => {
    // 1. On vérifie que le tag existe bien avant de le supprimer
    const tag = await this.tagRepository.findById(id);

    if (!tag) {
      throw new Error(`Le tag avec l'ID '${id}' est introuvable.`);
    }

    // 2. On effectue la suppression
    await this.tagRepository.delete(id);
  };
}
