# Vircle Payment

본 프로젝트는 버클에서 사용되는 기업회원용 결제와 관련된 마이크로 서비스입니다. 현재는 토스페이먼츠라는 PG사의 결제시스템을 이용하고 있으며, 추후 타 PG사를 추가, 교체할 수 있는 확장성을 고려해서 설계되어 있습니다. 각 결제수단 단위로 최상위 폴더가 구분되어 있습니다.

-   **Billing(빌링)** : 카드를 등록해두고 빌링키를 기준으로 정기적으로 자동 결제할 수 있는 결제수단
-   **Card(카드)** : 결제창에서 카드사를 선택하고 카드사 인증을 거쳐 결제할 수 있는 결제수단 (미구현)
-   **EasyPay(간편결제)** : 외부 간편결제 서비스 - 토스페이, 네이버페이, 삼성페이, 엘페이, 카카오페이, 페이코, LG페이, SSG페이 (미구현)
-   **Transfer(계좌이체)** : 결제창에서 고객이 입력한 계좌 정보로 결제 금액을 이체할 수 있는 결제수단 (미구현)
-   **VirtualAccount(가상계좌)** : 결제창에서 고객이 원하는 은행 정보를 입력받아 가상계좌 발급 후 해당 계좌에 주문금액이 입금되면 결제가 완료되는 결제수단 (미구현)

## 1. 개발환경

-   OS: Ubuntu 20.04, Node.js 16
-   Database: AWS DynamoDB, TypeORM
-   Language: TypeScript
-   Framework: Nest.js (Express)

## 2. 설치 및 실행

```bash
yarn workspace @vircle/payment install
yarn workspace @vircle/payment start
```

## 3. 폴더 구조

결제 패키지는 이벤트 중심의 설계 기법인 CQRS 패턴을 채용하였습니다. Nest.js 에서 제공하는 CQRS를 이용하여 개발되었습니다. https://docs.nestjs.com/recipes/cqrs#cqrs

```
src
└─ billing
    ├─ application      : 비지니스 로직
    │    ├─ command         : 커맨드 로직
    │    ├─ event           : 이벤트 핸들러
    │    ├─ query           : 데이터 조회 로직
    │    ├─ sagas           : 이벤트 구독 로직
    │    └─ services        : 서비스 로직
    ├─ domain           : 도메인 단위의 클래스 정의
    │  └─ event             : 각 클래스의 이벤트 핸들러 정의
    ├─ infrastructure
    │  ├─ api-client        : 외부 API 통신 로직
    │  └─ repository        : DB 데이터 엑세스 로직
    └─ interface        : REST 라우팅 컨트롤러
      ├─ dto                : DTO 모음
      └─ guards             : JWT 미들웨어
```

## 4. 배포

Payment 패키지는 로컬에서 Pull Request 시 Github Action 을 통해 자동으로 배포를 시작합니다. (작업중)
