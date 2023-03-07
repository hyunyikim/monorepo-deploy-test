import { Test, TestingModule } from "@nestjs/testing";
import { GuaranteeController } from "./guarantee.controller";
import { GuaranteeService } from "./guarantee.service";

describe("GuaranteeController", () => {
  let controller: GuaranteeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuaranteeController],
      providers: [GuaranteeService],
    }).compile();

    controller = module.get<GuaranteeController>(GuaranteeController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
