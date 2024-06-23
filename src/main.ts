import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //* Elimina "silenciosamente" las propiedades que no estén en el DTO. Previene la contaminación de objetos con datos innecesarios o maliciosos
      // forbidNonWhitelisted: true  //* Dispara una excepción en caso de venir propiedades no definidas en el DTO. Actúa antes que el whitelist
    })
  );
  await app.listen(3000);
}



bootstrap();
