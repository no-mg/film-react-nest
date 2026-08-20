import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

async function bootstrap() {
  const loggerType = process.env.LOGGER_TYPE || 'dev';
  let logger;

  switch (loggerType) {
    case 'json':
      logger = new JsonLogger();
      break;
    case 'tskv':
      logger = new TskvLogger();
      break;
    case 'dev':
    default:
      logger = new DevLogger();
      break;
  }

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: logger,
  });
  
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();