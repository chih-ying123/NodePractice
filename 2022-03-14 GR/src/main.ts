import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

const title = `${String.fromCharCode(27)}]0;接帳程式${String.fromCharCode(7)}` ;
process.stdout.write(title);