import type { Config } from "jest";

export default async (): Promise<Config> => {
  return {
    resolver: require.resolve(`jest-pnp-resolver`),
    verbose: true,
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: "src",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
      "^.+\\.(t|j)s$": "ts-jest",
    },
    collectCoverageFrom: ["**/*.(t|j)s"],
    coverageDirectory: "./coverage",
    testEnvironment: "node",
  };
};
