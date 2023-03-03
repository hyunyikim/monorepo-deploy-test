import { Test, TestingModule } from "@nestjs/testing";
import { GlobalModule } from "src/global.module";

import { SellerService } from "./seller.service";

describe("SellerService", () => {
  let service: SellerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GlobalModule],
      providers: [SellerService],
    }).compile();

    service = module.get<SellerService>(SellerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
