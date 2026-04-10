import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../repositories/tag.repository';
import { TagEntity } from '../../entities/tag.entity';

@Injectable()
export class GetTagsUseCase {
  constructor(private readonly tagRepository: TagRepository) {}

  // On récupère la liste de tous les tags existants.

  execute = async (): Promise<TagEntity[]> => {
    return this.tagRepository.findAll();
  };
}
