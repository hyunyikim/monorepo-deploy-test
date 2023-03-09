import { Test, TestingModule } from "@nestjs/testing";
import { InterworkController } from "./interwork.controller";
import { InterworkService } from "./interwork.service";

describe("InterworkController", () => {
  let controller: InterworkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterworkController],
      providers: [InterworkService],
    }).compile();

    controller = module.get<InterworkController>(InterworkController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
