import { SetMetadata } from '@nestjs/common';

// C'est la clé sous laquelle NestJS va stocker les rôles requis en métadonnées
export const ROLES_KEY = 'roles';

// Cette fonction prend une liste de rôles et les associe à la route
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
