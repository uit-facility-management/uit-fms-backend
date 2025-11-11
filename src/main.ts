import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import 'dotenv/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;
  const config = new DocumentBuilder()
    .setTitle('UIT Facility Management API')
    .setDescription('API docs for Facility & Room Management System')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
  Logger.log(
    `Swagger docs available at http://localhost:${port}/api/docs`,
    'Bootstrap',
  );
  
}
bootstrap();
