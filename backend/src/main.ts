import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function init() {
  const app = await NestFactory.create(AppModule);
  // Permissive by default so local dev and the demo keep working; set
  // CORS_ORIGINS (comma-separated) in production to lock it down.
  const origins = process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean);
  app.enableCors({ origin: origins?.length ? origins : true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // strip properties not declared in the DTO
      forbidNonWhitelisted: true, // 400 if the client sends unknown fields
      transform: true,            // auto-cast payloads to DTO instances
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
init();
