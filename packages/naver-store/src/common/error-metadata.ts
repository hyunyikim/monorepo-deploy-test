import { HttpStatus } from "@nestjs/common";

enum eErrorCode {
  NO_CONFIG_PATH = -1001,
  GET_CONFIG_FAILED = -1002,
}

export const ErrorMetadata = {
  noConfigFile: (path: string) => ({
    name: "NO_CONFIG_PATH",
    message: "config 파일이 없습니다.",
    code: eErrorCode.NO_CONFIG_PATH,
    description: "yaml파일이 있어야됨",
    status: HttpStatus.OK,
    options: {
      filePath: path,
    },
  }),
  getConfigFailed: (httpTarget: string) => ({
    name: "GET_CONFIG_FAILED",
    message: `${httpTarget} config 파일 로드 실패.`,
    code: eErrorCode.GET_CONFIG_FAILED,
    description: "config 파일이 정확한지 확인해보세요.",
    status: HttpStatus.OK,
    options: {
      filePath: (path: string) => path,
    },
  }),
  anythingElse: (
    desc: string,
    status: number,
    options: Record<string, any>
  ) => ({
    name: "anythingElse",
    message: `anythingElse`,
    code: -2000,
    description: desc,
    status: status,
    options: options,
  }),
} as const;
