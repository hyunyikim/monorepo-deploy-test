import { Test, TestingModule } from "@nestjs/testing";
import { expectTypeOf } from "expect-type";

import { GlobalModule } from "src/global.module";
import { GetAccessTokenResponse } from "src/naver-api/interfaces/naver-store-api.interface";

import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GlobalModule],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expectTypeOf(
      service.createToken()
    ).resolves.toEqualTypeOf<GetAccessTokenResponse>();
  });
});
