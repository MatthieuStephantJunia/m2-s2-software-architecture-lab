import { SetMetadata } from '@nestjs/common';

// On définit une clé secrète que NestJS va attacher à notre route
export const IS_PUBLIC_KEY = 'isPublic';

// Ce décorateur va attacher la valeur "true" à la métadonnée 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
