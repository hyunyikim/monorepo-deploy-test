import { Test, TestingModule } from "@nestjs/testing";
import { AxiosError, AxiosResponse } from "axios";

import { TokenInfo } from "src/common/getToken.decorator";
import { GlobalModule } from "src/global.module";
import { NaverStoreInterwork } from "src/interwork/entities/interwork.entity";
import { InterworkRepository } from "src/interwork/entities/interwork.repository";
import { GetAccessTokenResponse } from "src/naver-api/interfaces/naver-store-api.interface";

import { InterworkService } from "./interwork.service";

const accountId = "ncp_1njkqz_02";
const partnerToken = {
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjEwNDYsInR5cGUiOiJCIiwiYjJiVHlwZSI6IkIiLCJpYXQiOjE2Nzg2NjM4MjMsImV4cCI6NDgzMjI2MzgyM30.k2Vm2AurofniOwyqqPiMn93oq0pTw_k5S4utYuSwO40",
} as TokenInfo;

describe("InterworkService", () => {
  let service: InterworkService;
  let interworkRepo: InterworkRepository;
  let actualInterwork: NaverStoreInterwork;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GlobalModule],
      providers: [InterworkService],
    }).compile();

    service = module.get<InterworkService>(InterworkService);
    interworkRepo = module.get<InterworkRepository>(InterworkRepository);
    actualInterwork = await service.getInterworkByAccountId(accountId);
  });

  afterAll(async () => {
    await interworkRepo.putInterwork(actualInterwork);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  describe("최초 연동 시", () => {
    describe("accountId가 있을 때", () => {
      it("연동에 성공한다.", async () => {
        expect(
          service.initInterwork(accountId, partnerToken)
        ).resolves.toBeInstanceOf(GetAccessTokenResponse);
      });
    });

    describe("accountId가 없을 때", () => {
      it("partners 토큰 값이 틀리면 실패한다.", async () => {
        jest
          .spyOn(interworkRepo, "getInterworkByAccountId")
          .mockResolvedValueOnce(null);

        let error: AxiosError = {} as AxiosError;
        try {
          await service.initInterwork(accountId, {
            token: "test",
          } as TokenInfo);
        } catch (e) {
          error = e as AxiosError;
        }

        expect(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (error.response as AxiosResponse).data.code
        ).toMatch("TOKEN_VERIFY_ERROR");
      });

      it("accountId가 틀리면 실패한다.", async () => {
        jest
          .spyOn(interworkRepo, "getInterworkByAccountId")
          .mockResolvedValueOnce(null);

        let error: AxiosError = {} as AxiosError;
        try {
          await service.initInterwork("test", partnerToken);
        } catch (e) {
          error = e as AxiosError;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect((error.response as AxiosResponse).data.code).toMatch(
          "DataAccessDenied"
        );
      });

      it("연동에 성공한다.", async () => {
        jest
          .spyOn(interworkRepo, "getInterworkByAccountId")
          .mockResolvedValueOnce(null);

        expect(
          await service.initInterwork(accountId, partnerToken)
        ).toBeInstanceOf(GetAccessTokenResponse);
      });
    });
  });
  describe("연동 해제 시", () => {
    it("연동 해제에 성공한다.", () => {
      jest
        .spyOn(service, "getInterworkByPartnerToken")
        .mockResolvedValueOnce(new NaverStoreInterwork());

      // expect(service.unlinkInterwork(partnerToken, "test")).resolves.match;
    });
  });
  describe("토큰 갱신", () => {});
  describe("카테고리 조회", () => {});
  describe("연동정보 갱신", () => {});
  describe("연동정보 조회", () => {});
});
