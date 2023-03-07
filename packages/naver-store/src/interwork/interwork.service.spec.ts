import { Test, TestingModule } from "@nestjs/testing";
import { InterworkService } from "./interwork.service";

describe("InterworkService", () => {
  let service: InterworkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterworkService],
    }).compile();

    service = module.get<InterworkService>(InterworkService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
