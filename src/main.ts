import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { CUSTOM_ERROR_CODES } from './common/constants';
import { errorApiResponse } from './common/helpers/response.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({
    credentials: true,
    origin: ['*'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map(
          (error) => error.constraints?.[Object.keys(error.constraints)[0]],
        )[0];
        return new BadRequestException(
          errorApiResponse({
            message: 'Validation error',
            errorCode: CUSTOM_ERROR_CODES.REQ_BODY_VALIDATION_FAILED,
            devErrorMessage: result,
          }),
        );
      },
      stopAtFirstError: true,
    }),
  );

  // Needed when GlobalExceptionsFilter handler is setup
  // const httpAdapter = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.setGlobalPrefix('api', { exclude: ['/'] });

  const config = new DocumentBuilder()
    .setTitle('Record Financial Backend')
    .setDescription('Backend API docs for Record Financial Backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Needed if using Zod
  // patchNestjsSwagger();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    process.env.NODE_ENV != 'production' ? 'api' : 'api-658182234578346767345',
    app,
    document,
  );

  const configService = app.get(ConfigService);
  const _PORT: number | string = configService.get('PORT') || 3000;
  await app.listen(_PORT).then(() => {
    console.log(`🚀 Server running on http://localhost:${_PORT}`);
  });
}

void bootstrap();
