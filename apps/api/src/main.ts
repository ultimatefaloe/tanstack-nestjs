import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const port = process.env.PORT ?? 5100
async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({ origin: "http://localhost:3000" })
  await app.listen(port).then(() => logger.log("App listen on: ", port));

}
bootstrap();
