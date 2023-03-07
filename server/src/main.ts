import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { logRequest } from './middleware/log-requests.middleware';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const serverConfig = config.get('server');

  const port = process.env.PORT || serverConfig.port;
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'development'){
    app.enableCors();
    logger.verbose('cors enabled');
  }
  app.use(logRequest);
  await app.listen(port);
  logger.verbose(`Server listening on port: ${port}`);
}
bootstrap();
