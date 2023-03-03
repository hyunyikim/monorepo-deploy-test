import { Test, TestingModule } from "@nestjs/testing";

import { SellerService } from "./seller.service";
import { SellerController } from "./seller.controller";

describe("SellerController ", () => {
  let controller: SellerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerController],
      providers: [SellerService],
    }).compile();

    controller = module.get<SellerController>(SellerController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
