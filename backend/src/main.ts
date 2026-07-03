import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { JwtGuard } from './auth/guards/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, forbidNonWhitelisted: false }),
  );

  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalGuards(new JwtGuard(reflector));

  app.enableCors({
    origin: [
      'https://pavnen.diploma.nomorepartiessite.ru',
      'http://pavnen.diploma.nomorepartiessite.ru',
      'http://localhost:4000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(3000);
}

bootstrap();
