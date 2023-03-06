## Description

Naver Store 프로젝트

## Installation

```bash
$ yarn install
$ aws s3 cp s3://mass-adoption.app.env/vircle/naver-store/env/{local|development|stage|production}.yaml ./env/{local|development|stage|production}.yaml
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:debug
or
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## TODO-List

- 배포 시스템 개편
- 테스트 코드 작성
- Swagger 작성
- Readme 작성
- Error Code 룰 논의
- Error Code 룰 논의
