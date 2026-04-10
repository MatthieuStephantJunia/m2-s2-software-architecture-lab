import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../../infrastructure/roles.decorator';
import { RequestWithUser } from '../../application/interfaces/request-with-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  // Le Reflector permet de lire les métadonnées définies par notre décorateur @Roles
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // On récupère les rôles requis pour la route actuelle
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si la route n'a pas de décorateur @Roles, on autorise l'accès
    if (!requiredRoles) {
      return true;
    }

    // On récupère l'utilisateur injecté dans la requête par le JwtAuthGuard
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // Si pas d'utilisateur on refuse ( normalement JwtAuthGuard s'en occupe )
    if (!user) {
      return false;
    }

    // On vérifie si le rôle de l'utilisateur fait partie des rôles requis
    return requiredRoles.includes(user.role);
  }
}
