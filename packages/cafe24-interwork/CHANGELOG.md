# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.3](https://github.com/mass-adoption/vircle/compare/cafe24-v0.0.2...cafe24-v0.0.3) (2022-09-05)


### Features

* **cafe24:** :rocket: 보증서 발급 이벤트 데이터(dynamodb)에 product 정보를 추가 ([#116](https://github.com/mass-adoption/vircle/issues/116)) ([0f4fb4f](https://github.com/mass-adoption/vircle/commit/0f4fb4f0001de49ce59e37ac04efda963ec79df4))
* **cafe24:** :zap: cafe24 연동 여부 확인 비지니스 로직 변경 ([#113](https://github.com/mass-adoption/vircle/issues/113)) ([bfe8962](https://github.com/mass-adoption/vircle/commit/bfe89627faf3ab76c4127c09104f9d31c28078b1))
* **common:** ⚡ vircle common 프로젝트 init ([#106](https://github.com/mass-adoption/vircle/issues/106)) ([0ba6e5d](https://github.com/mass-adoption/vircle/commit/0ba6e5d4424c7dd01d650df70ad2dde75c371001))


### Bug Fixes

* **cafe24:** :ambulance: jwt guard가 동작 에러 해결 ([#112](https://github.com/mass-adoption/vircle/issues/112)) ([c2eeae4](https://github.com/mass-adoption/vircle/commit/c2eeae4d73408e0322f6ff4a66fa91a5353cf43c))
* **cafe24:** :ambulance: routing 에러 수정 ([#111](https://github.com/mass-adoption/vircle/issues/111)) ([4446ed3](https://github.com/mass-adoption/vircle/commit/4446ed3986a54117f35aafd15079dd6c28de6867))
* **cafe24:** after.install.sh에 있는 syntax error 수정 ([#110](https://github.com/mass-adoption/vircle/issues/110)) ([ba6be22](https://github.com/mass-adoption/vircle/commit/ba6be22b69366b72ba2b7456e6c401ee0d678a0a))
* **cafe24:** appspec script location error ([#118](https://github.com/mass-adoption/vircle/issues/118)) ([06ba246](https://github.com/mass-adoption/vircle/commit/06ba24632d5a2318be70eb34afd07f13f759eb11))

### 0.0.2 (2022-08-25)


### Features

* **cafe24:** :memo: api를 통해 보안적으로 민감한 정보의 노출을 차단 ([#102](https://github.com/mass-adoption/vircle/issues/102)) ([df2879c](https://github.com/mass-adoption/vircle/commit/df2879cec89d6933d45cc54f837dac088d8b312b))
* **cafe24:** slack report에서 개발환경은 메세지 헤더에 추가적으로 표시 ([#101](https://github.com/mass-adoption/vircle/issues/101)) ([eebc479](https://github.com/mass-adoption/vircle/commit/eebc47991685a8d08e2b61954470081d99039a05))


### Bug Fixes

### 0.0.1 (2022-08-22)


### Features

* **cafe24:** :ambulance: error 처리를 위한 Exception Filter 적용 ([#80](https://github.com/mass-adoption/vircle/issues/80)) ([92cd4eb](https://github.com/mass-adoption/vircle/commit/92cd4ebd25e586c7674dfa18f3644f81ab7903f8))
* **cafe24:** :art: winton과 aws cloud-watch 기반의 로깅 기능 추가 ([#79](https://github.com/mass-adoption/vircle/issues/79)) ([6ff6183](https://github.com/mass-adoption/vircle/commit/6ff61837b300f4ade5ac4540f403340aae699a39))
* **cafe24:** :fire: healthcheck용 api 변경 ([#65](https://github.com/mass-adoption/vircle/issues/65)) ([e817b07](https://github.com/mass-adoption/vircle/commit/e817b0765b7c8d1d4dec4e4b6fe22b072ed0a3c9))
* **cafe24:** :memo: url 기반의 api versioning ([#81](https://github.com/mass-adoption/vircle/issues/81)) ([eee156d](https://github.com/mass-adoption/vircle/commit/eee156d32a558b92f32e34e7eed43debb6953cd1))
* **cafe24:** :sparkles: cafe24 interwork 서비스 모듈 ([#59](https://github.com/mass-adoption/vircle/issues/59)) ([a493fa2](https://github.com/mass-adoption/vircle/commit/a493fa20e6d07dc7f80fd5b247124c6e1bab5c32))
* **cafe24:** :zap: slack api로 연동 정보 리포트 ([#78](https://github.com/mass-adoption/vircle/issues/78)) ([2fc93e3](https://github.com/mass-adoption/vircle/commit/2fc93e34bff2289b68f748c652cdb28709f60945))
* **cafe24:** ⚡ http 요청에 대해서 cors 허용 ([#68](https://github.com/mass-adoption/vircle/issues/68)) ([0819cc9](https://github.com/mass-adoption/vircle/commit/0819cc99740a743240b78f61d98406a0c120e29f))
* **cafe24:** ✨ 카페24 api 호출 메서드 구현 ([#58](https://github.com/mass-adoption/vircle/issues/58)) ([ab62445](https://github.com/mass-adoption/vircle/commit/ab62445722866cb28ebb4d3932cad8d2f816b184))
* **cafe24:** 배송 이벤트 처리 로직 구현 ([#74](https://github.com/mass-adoption/vircle/issues/74)) ([c308638](https://github.com/mass-adoption/vircle/commit/c308638b9dca2f34fe6af244f083bbba05adfa05))
* **cafe24:** 연동 해제 사유를 업데이트 하는 api 개발 ([#73](https://github.com/mass-adoption/vircle/issues/73)) ([75d1095](https://github.com/mass-adoption/vircle/commit/75d10956b042fd84670057979890e712515a6734))
* **cafe24:** 카페24 WebHook 처리 엔드포인드 구현 ([#66](https://github.com/mass-adoption/vircle/issues/66)) ([b00ceb9](https://github.com/mass-adoption/vircle/commit/b00ceb983a4ba752054a42c17435f506bad3954a))
* **cafe24:** cafe24 환불/교환 이벤트 처리 ([#84](https://github.com/mass-adoption/vircle/issues/84)) ([a627efa](https://github.com/mass-adoption/vircle/commit/a627efae73e87fc8a4a4ed84e5a9cfa23e5d5c77))
* **cafe24:** cafe24 webhook 동작 중에 만료가 임박한 토큰 리프레시 ([#83](https://github.com/mass-adoption/vircle/issues/83)) ([3b15c67](https://github.com/mass-adoption/vircle/commit/3b15c67fee7a1efe8dfab6a80659fef92b29d1f4))
* **cafe24:** cafe24-controller 모듈 구현 ([#60](https://github.com/mass-adoption/vircle/issues/60)) ([c5e005e](https://github.com/mass-adoption/vircle/commit/c5e005e8fe60a205a97ce12c0d320c3e94a043c7))
* **cafe24:** health-check api 엔드포인트 추가 ([#61](https://github.com/mass-adoption/vircle/issues/61)) ([610192e](https://github.com/mass-adoption/vircle/commit/610192ef89969a5bb90e0c88ba80b9c9ab8a5164))


### Bug Fixes

* 🔥 core-api auth error 문제 해결 ([#75](https://github.com/mass-adoption/vircle/issues/75)) ([c1b7262](https://github.com/mass-adoption/vircle/commit/c1b72620a1f0e0b0d198b35a6520be996fe37957))
* 새로 사용하는 authCode에 대해서는 연동 프로세스 허용 ([#70](https://github.com/mass-adoption/vircle/issues/70)) ([caaf912](https://github.com/mass-adoption/vircle/commit/caaf9122b49f04aca5c661a2c4d6589681370b70))
* **cafe24:** :bug: aws-cloudwatch region 설정(ap-northeast-2) ([#82](https://github.com/mass-adoption/vircle/issues/82)) ([9abe114](https://github.com/mass-adoption/vircle/commit/9abe114ec45809d5abf3f6345675deb29ad0e7c1))
* **cafe24:** batch 형태의 주문 처리 ([#86](https://github.com/mass-adoption/vircle/issues/86)) ([573db53](https://github.com/mass-adoption/vircle/commit/573db530784a2504ad2c307d4cd3cd8d2baaca51))
* **cafe24:** webhook에서 x-api-key 헤더를 못찾는 문제 해결 ([#76](https://github.com/mass-adoption/vircle/issues/76)) ([7301327](https://github.com/mass-adoption/vircle/commit/73013270fb4e0c4a9bc35b8d26aab5cf906850b4))