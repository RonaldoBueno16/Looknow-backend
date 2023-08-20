import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('LookNow API')
    .setDescription('BACKEND da LookNow (Hackaton Base27)')
    .setVersion('1.0.0')
    .addTag('looknow')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);


  await app.listen(7444);
}
bootstrap();
