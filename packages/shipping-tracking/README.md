# Shipping-Tracking

## Author

-   Author - [Yaeger Moon](https://github.com/YaegerMoon)
-   Email - yaeger@mass-adoption.com
-   Phone - 010-4516-7046
-   Slack ID - @Yaeger

---

## Description

`shipping-tracking`은 택배송장 번호를 기반으로 배송이력 정보를 제공하기 위한 HTTP 서버 입니다.

---

## Package Manager

@vircle/shipping-tracking 프로젝트는 `yarn v3`을 패키지 매니저로 사용합니다.

## Installation

**vircle** 프로젝트는 `yarn plug'n play`를 이용하여 **Zero-Install**을 적용하였습니다. 따라서 추가적인 의존성 설치 작업이 필요 없습니다.

## Run on Dev Mode

```bash
$ yarn start
```

## Run on Watch Mode

```bash
$ yarn start:watch
```

## Run on Production Mode

```bash
$ yarn start:prod
```

## Build

```bash
$ yarn build
```

## Docker build

```bash
# 프로젝트 루트로 이동하기
cd ../../

# docker 빌드 명령어
docker build -t vircle/shipping-tracking:{version} -f ./packages/shipping-tracking/Dockerfile .

```

## Docker run

```bash
docker run -it --name {container-name} vircle/shipping-tracking:{version}
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
