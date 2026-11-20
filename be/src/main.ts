import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 8005;
  app.setGlobalPrefix('/api');
  await app.listen(PORT);
  console.log(`BE running on http://localhost:${PORT}/api`)
}
bootstrap();
