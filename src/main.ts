import { HttpStatus, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { HttpExceptionFilter } from './api/common/filters/http-exception.filter';
import { AppConfig } from './api/types/index';
import { AppModule } from './app/app.module';
import { appConfiguration } from './api/configuration/app.configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get<AppConfig>(appConfiguration.KEY);
  app.enableCors({
    credentials: true,
    origin: appConfig.clientDomain,
  });

  const logger = new Logger('NestApplication');
  app.use(compression());
  app.use(helmet());
  app.use(cookieParser());

  const options = new DocumentBuilder()
    .setTitle('Auth-Nestjs-Mongodb')
    .setDescription('API Documentation for Auth')
    .setVersion('1.0.0')
    .addServer(`${appConfig.domain}/api/`, 'Development API')
    .addBearerAuth()
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, swaggerDoc, {
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });
  logger.debug(`Swagger Docs enabled: ${appConfig.domain}/docs`);

  app.use('/robots.txt', (_, res) => {
    /* eslint-disable-next-line  no-useless-concat */
    res.send('User-Agent: *\n' + 'Disallow: /');
  });
  app.use('/favicon.ico', (_, res) => {
    res.sendStatus(HttpStatus.NO_CONTENT).end();
  });
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(appConfig.port, () => {
    logger.log(`Listening at ${appConfig.domain}/`);
  });
}

bootstrap();
