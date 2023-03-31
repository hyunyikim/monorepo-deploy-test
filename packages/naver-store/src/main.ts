import { NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";

import { ENV } from "src/common/enums/env.enum";

import { AppModule } from "./app.module";
import { RequestInterceptor } from "./common/request.interceptor";
import { ResponseInterceptor } from "./common/response.interceptor";
import { AllExceptionsFilter } from "./common/all-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new RequestInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: { enableImplicitConversion: true },
      whitelist: true, // validation을 위한 decorator가 붙어있지 않은 속성들은 제거
      forbidNonWhitelisted: true, // whitelist 설정을 켜서 걸러질 속성이 있다면 아예 요청 자체를 막도록 (400 에러)
      transform: true,
    })
  );

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: "v",
  });
  addSwagger(app);
  app.enableCors();

  await app.listen(3000);
}
bootstrap();

function addSwagger(app: INestApplication) {
  if (process.env.NODE_ENV !== ENV.PRODUCTION) {
    const builder = new DocumentBuilder()
      .setTitle("Naver Store API")
      .setDescription("Naver Store API 문서입니다.")
      .setVersion("1.0")
      .addBearerAuth(
        {
          type: "http",
          scheme: "bearer",
          bearerFormat: "Jwt",
          name: "Token",
          in: "header",
          description:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjExMDAsInR5cGUiOiJCIiwiYjJiVHlwZSI6IkIiLCJpYXQiOjE2ODAyMjU1NjAsImV4cCI6NDgzMzgyNTU2MH0.UgJMIu0lysvXClUYsPY1dK3akIE3CH7apYnV8LwwUZ0",
        },
        "Token"
      );

    process.env.NODE_ENV !== ENV.LOCAL && builder.addServer("/naver-store");
    const config = builder.build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);
  }
}
