import { NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";

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
  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
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
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjEwNDYsInR5cGUiOiJCIiwiYjJiVHlwZSI6IkIiLCJpYXQiOjE2Nzg2NjM4MjMsImV4cCI6NDgzMjI2MzgyM30.k2Vm2AurofniOwyqqPiMn93oq0pTw_k5S4utYuSwO40",
        },
        "Token"
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);
  }
}
