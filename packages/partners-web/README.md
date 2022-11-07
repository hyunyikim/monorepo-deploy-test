# partners-web

> 기존 버클 파트너스 웹에서 새로 개발중인 신규 프로젝트입니다.  
> 한 번에 신규 프로젝트로 옮기기에는 어려움이 있기 때문에, 해당 프로젝트는 기존의 버클 파트너스 웹에서 Iframe 형태로 서비스 되고 있습니다. (2022-11-07 기준)

## 1. 개발 환경

-   `react`
-   `typescript`
-   `mui`, `emotion`
-   `zustand`, `react-query`
-   `webpack`

## 2. 설치 및 실행

```ts
yarn workspace @vircle/partners-web install
yarn workspace @vircle/partners-web dev
```

## 3. 폴더 구조

-   @types
    -   타입 정의
-   api
    -   api 호출 코드
-   assets
    -   이미지, 아이콘, scss 파일 모음
-   components

    -   공통적으로 사용하는 컴포넌트 모음
    -   common

        -   atomic design system을 기반으로 만듦
        -   atoms
            -   가장 기반이 되는 컴포넌트
            -   ex) Button, Input, Label
        -   molecules
            -   atom의 조합으로 만들어진 컴포넌트
            -   ex) Search(Input + Button)
        -   organisms
            -   atom, molecule의 조합으로 만들어진 컴포넌트

-   data
    -   데이터 및 도메인 별 공통으로 사용되는 코드 모음
-   features
    -   각 기능별로 사용하는, 비즈니스 로직이 포함된 컴포넌트
-   store

    -   상태 관리

-   utils
    -   hooks
        -   공통 훅 모음
    -   schema
        -   yup의 validate schema 모음
