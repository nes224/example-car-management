import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 8005;
  app.setGlobalPrefix('/api');

  const config = new DocumentBuilder()
    .setTitle('Car Management API')
    .setDescription('CRUD + search data for car')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT);
  console.log(`BE running on http://localhost:${PORT}/api`);
  console.log(`Swagger docs running on http://localhost:${PORT}/api/docs`);
}
bootstrap();
