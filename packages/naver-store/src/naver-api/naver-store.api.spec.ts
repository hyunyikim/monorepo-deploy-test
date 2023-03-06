import { Test } from "@nestjs/testing";
import { expectTypeOf } from "expect-type";

import { GlobalModule } from "src/global.module";
import { GetAccessTokenResponse } from "src/naver-api/interfaces/naver-store-api.interface";
import { NaverStoreApi } from "src/naver-api/naver-store.api";

describe("NaverStoreApi", () => {
  let api: NaverStoreApi;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [GlobalModule],
    }).compile();

    api = moduleRef.get(NaverStoreApi);
    await api.onModuleInit();
  });

  it("모듈 생성과 함께 naver token이 존재한다.", () => {
    expect(api.naverToken).toBeTruthy();
  });
  it("게터 함수", () => {
    expect(api.getAccessToken()).toBe(api.naverToken);
  });
  it("모듈 생성과 함께 naver token이 존재함", () => {
    expectTypeOf(
      api.setAccessToken()
    ).resolves.toEqualTypeOf<GetAccessTokenResponse>();
  });
});
