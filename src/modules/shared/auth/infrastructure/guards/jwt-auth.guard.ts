import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // On regarde si la route ou le contrôleur a le décorateur @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si c'est public, on retourne true immédiatement (on bypass l'authentification)
    if (isPublic) {
      return true;
    }

    // Sinon, on laisse le comportement normal de Passport vérifier le token JWT
    return super.canActivate(context);
  }
}
