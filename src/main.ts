import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { OpenAIService } from './modules/contrato/services/openai.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('LookNow API')
    .setDescription('BACKEND da LookNow (Hackaton Base27)')
    .setVersion('1.0.0')
    .addTag('looknow')
    .build();

  // const teste = new OpenAIService().getResumeFromText();


  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


  await app.listen(7444);
}
bootstrap();
