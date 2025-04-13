import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('localhost+1-key.pem'),
  //   cert: fs.readFileSync('localhost+1.pem'),
  // };

  // const app = await NestFactory.create(AppModule, { httpsOptions });
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');

  app.use(cookieParser());

  app.enableCors({
    allowedHeaders: ['content-type', 'authorization', 'accept', 'x-requested-with'],
    origin: true, // Permite todas as origens
    credentials: true, // Permite envio de cookies
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  const config = new DocumentBuilder()
    .setTitle('Documentação da API') // Título exibido no topo do Swagger
    .setDescription('API - TCC Adriano') // Descrição da API
    .setVersion('1.0') // Versão da API
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth',
    )
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não declaradas no DTO
      forbidNonWhitelisted: false, // Não lança erro para propriedades não declaradas
      transform: true, // Transforma tipos automaticamente
      transformOptions: {
        enableImplicitConversion: true, // Permite conversões implícitas
      },
    }),
  );

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      tagsSorter: (a, b) => {
        const order = ['Auth', 'User'];
        const indexA = order.indexOf(a);
        const indexB = order.indexOf(b);

        if (indexA > -1 && indexB > -1) {
          return indexA - indexB;
        } else if (indexA > -1) {
          return -1;
        } else if (indexB > -1) {
          return 1;
        }
        return a.localeCompare(b);
      },
      operationsSorter: (a, b) => {
        const httpMethodsOrder = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
        const indexA = httpMethodsOrder.indexOf(a.get('method'));
        const indexB = httpMethodsOrder.indexOf(b.get('method'));

        if (indexA > -1 && indexB > -1) {
          return indexA - indexB;
        }
        return 0;
      },
    },
  });

  const port = process.env.PORT || 8080;

  await app.listen(port, '0.0.0.0');

  Logger.log(`Application is running on: ${await app.getUrl()}`);
  Logger.log(`Swagger is running on: ${await app.getUrl()}/api-docs`);
}

bootstrap();
