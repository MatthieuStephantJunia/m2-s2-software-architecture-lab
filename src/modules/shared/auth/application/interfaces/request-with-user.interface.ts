import { Request } from 'express';

// 1. On définit ce que contient le payload de ton token JWT
export interface JwtPayload {
  id: string;
  username: string;
  email: string;
  role: string;
}

// 2. On étend l'objet Request natif d'Express pour lui ajouter notre utilisateur
export interface RequestWithUser extends Request {
  user: JwtPayload;
}
