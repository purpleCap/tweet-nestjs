import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // going to strip out any extra property sent in the request body
    forbidNonWhitelisted: true, // going to throw error if any extra property is sent in the request body
    transform: true, // going to transform the request body into the DTO class instance
    transformOptions: {
      enableImplicitConversion: true, // going to enable implicit conversion of request body properties into the DTO class properties
    }
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
