import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './modules/shared/errors/infrastructure/filters/domain-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Medium-like API')
    .setDescription(
      "Documentation de l'API pour le projet final d'Architecture Logicielle",
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI sera accessible sur /api
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new DomainExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);
  // ou await app.listen(process.env.PORT || 3000); ?
}

void bootstrap();
