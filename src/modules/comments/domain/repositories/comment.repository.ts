import { CommentEntity } from '../entities/comment.entity';

export abstract class CommentRepository {
  //Sauvegarde un nouveau commentaire ou met à jour un commentaire existant.

  abstract save(comment: CommentEntity): Promise<void>;

  //Récupère tous les commentaires ad'un article

  abstract findByPostId(postId: string): Promise<CommentEntity[]>;

  //Récupère un commentaire spécifique par son ID
  abstract findById(id: string): Promise<CommentEntity | null>;

  //Supprime un commentaire de la base de données
  abstract delete(id: string): Promise<void>;
}
