# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.0](https://github.com/mass-adoption/vircle/compare/cafe24-v0.0.2...cafe24-v0.2.0) (2022-10-28)


### ⚠ BREAKING CHANGES

* **cafe24:** ⚡ 주문 완료시에 구매자에게 카카오톡 알림 발송  (#147)
### Features
* **cafe24:** ⚡ 주문 완료시에 구매자에게 카카오톡 알림 발송  ([#147](https://github.com/mass-adoption/vircle/issues/147)) ([5ffc026](https://github.com/mass-adoption/vircle/commit/5ffc026e096b93a40dc805c25e531d5fd691caa4))
* **cafe24:** 게런티 발송 알림 별송 여부 설정에 따라 발송 처리 ([#149](https://github.com/mass-adoption/vircle/issues/149)) ([77ae772](https://github.com/mass-adoption/vircle/commit/77ae7723f63e19db3e1c50643930ed45f138b0e5))
* **cafe24:** 디지털 게런티 알림톡 설정 ([#148](https://github.com/mass-adoption/vircle/issues/148)) ([1283c81](https://github.com/mass-adoption/vircle/commit/1283c81dcfb5fb50b8f0ac58063e9ca3bc23486b))


### Bug Fixes
* **cafe24:** 사전 발송 알림톡 쇼핑몰 이름 => 회사이름 ([#150](https://github.com/mass-adoption/vircle/issues/150)) ([a4a80ac](https://github.com/mass-adoption/vircle/commit/a4a80acf25c8e16ddcf7d630b953ec285a8b017c))


## [0.1.0](https://github.com/mass-adoption/vircle/compare/cafe24-v0.0.2...cafe24-v0.1.0) (2022-10-20)


### ⚠ BREAKING CHANGES

* **cafe24:** 카테고리 정보 제공 api 생성 (#138)

### Features

* 상품 사진 이미지를 다운로드 하여 등록 ([#128](https://github.com/mass-adoption/vircle/issues/128)) ([9da61b9](https://github.com/mass-adoption/vircle/commit/9da61b9576a3a57fad544612d37d35641d0cdb99))
* **cafe24:** :rocket: 보증서 발급 이벤트 데이터(dynamodb)에 product 정보를 추가 ([#116](https://github.com/mass-adoption/vircle/issues/116)) ([0f4fb4f](https://github.com/mass-adoption/vircle/commit/0f4fb4f0001de49ce59e37ac04efda963ec79df4))
* **cafe24:** :zap: cafe24 연동 여부 확인 비지니스 로직 변경 ([#113](https://github.com/mass-adoption/vircle/issues/113)) ([bfe8962](https://github.com/mass-adoption/vircle/commit/bfe89627faf3ab76c4127c09104f9d31c28078b1))
* **cafe24:** 개런티 신청 정보 조회 API 생성 ([#142](https://github.com/mass-adoption/vircle/issues/142)) ([f2467b4](https://github.com/mass-adoption/vircle/commit/f2467b468f265688f387c45189d32e3f1dfd62d2))
* **cafe24:** 이미지 업로드 형태를 buffer에서 readable stream으로 변경 ([#133](https://github.com/mass-adoption/vircle/issues/133)) ([cadc6c3](https://github.com/mass-adoption/vircle/commit/cadc6c3fb9b32bc89c42029c1f3f4681693a6e1e))
* **cafe24:** 카테고리 정보 제공 api 생성 ([#138](https://github.com/mass-adoption/vircle/issues/138)) ([b61a3d1](https://github.com/mass-adoption/vircle/commit/b61a3d16503b78e85d840fbdfd8283e4962e143a))
* **cafe24:** 카테고리 api query option 파라미터 추가 ([#139](https://github.com/mass-adoption/vircle/issues/139)) ([b5c10d7](https://github.com/mass-adoption/vircle/commit/b5c10d72a0d0501e80087176477ac4e03c900766))
* **cafe24:** batch 주문을 처리하도록 설정 ([#125](https://github.com/mass-adoption/vircle/issues/125)) ([dddfa42](https://github.com/mass-adoption/vircle/commit/dddfa425d2d1a44f50cec060fd2916d0bd2826db))
* **cafe24:** buffer 형태로 이미지를 업로드 ([#129](https://github.com/mass-adoption/vircle/issues/129)) ([9b4dc98](https://github.com/mass-adoption/vircle/commit/9b4dc98d5c923e5f28ac94e298cbbcacc8c47fda))
* **common:** ⚡ vircle common 프로젝트 init ([#106](https://github.com/mass-adoption/vircle/issues/106)) ([0ba6e5d](https://github.com/mass-adoption/vircle/commit/0ba6e5d4424c7dd01d650df70ad2dde75c371001))


### Bug Fixes

* **cafe24:** :ambulance: jwt guard가 동작 에러 해결 ([#112](https://github.com/mass-adoption/vircle/issues/112)) ([c2eeae4](https://github.com/mass-adoption/vircle/commit/c2eeae4d73408e0322f6ff4a66fa91a5353cf43c))
* **cafe24:** :ambulance: routing 에러 수정 ([#111](https://github.com/mass-adoption/vircle/issues/111)) ([4446ed3](https://github.com/mass-adoption/vircle/commit/4446ed3986a54117f35aafd15079dd6c28de6867))
* **cafe24:** 상품 이미지가 없는 주문에 대한 처리 ([#132](https://github.com/mass-adoption/vircle/issues/132)) ([cd44ff6](https://github.com/mass-adoption/vircle/commit/cd44ff6e68ca7fb2e4c3fb08e6d893084d5a5b3c))
* **cafe24:** 연동을 해제한 사람의 연동 데이터가 조회되는 문제 해결 ([#124](https://github.com/mass-adoption/vircle/issues/124)) ([f85f620](https://github.com/mass-adoption/vircle/commit/f85f620db0e88ea2c4324bb3fe396eaccc17301f))
* **cafe24:** 컨트롤러 파라미터 오류 수정 ([#145](https://github.com/mass-adoption/vircle/issues/145)) ([c23bb19](https://github.com/mass-adoption/vircle/commit/c23bb19ad74a344d6f6d93df583b8f14d8fecb60))
* **cafe24:** after.install.sh에 있는 syntax error 수정 ([#110](https://github.com/mass-adoption/vircle/issues/110)) ([ba6be22](https://github.com/mass-adoption/vircle/commit/ba6be22b69366b72ba2b7456e6c401ee0d678a0a))
* **cafe24:** appspec script location error ([#118](https://github.com/mass-adoption/vircle/issues/118)) ([06ba246](https://github.com/mass-adoption/vircle/commit/06ba24632d5a2318be70eb34afd07f13f759eb11))
* **cafe24:** controller path 설정 오류 수정 ([#144](https://github.com/mass-adoption/vircle/issues/144)) ([64885ec](https://github.com/mass-adoption/vircle/commit/64885ec493d5a14bc1c47fab0477cbe04f3e3a83))
* **cafe24:** orderId 파싱에러 수정 ([#126](https://github.com/mass-adoption/vircle/issues/126)) ([041c906](https://github.com/mass-adoption/vircle/commit/041c9063c4d6324aea8c78c86bd14c21b45f405a))
* **cafe24:** orderId가 이상하게 저장되는 문제 해결 ([#127](https://github.com/mass-adoption/vircle/issues/127)) ([3b39810](https://github.com/mass-adoption/vircle/commit/3b39810de79509cfe6529ba4d5e925b45ca6711f))
* **cafe24:** partnerInfo에서 brand의 nullsafe 처리 ([#122](https://github.com/mass-adoption/vircle/issues/122)) ([b7e319e](https://github.com/mass-adoption/vircle/commit/b7e319ee90682f357246313a906aef46ee5c24fd))

### [0.0.5](https://github.com/mass-adoption/vircle/compare/cafe24-v0.0.2...cafe24-v0.0.5) (2022-09-13)

### Bug Fixes

* **cafe24:** 상품 이미지가 없는 주문에 대한 처리 ([a9f8e32](https://github.com/mass-adoption/vircle/commit/a9f8e32941518415c5b4fbed86df728f6bde12a0))


### [0.0.4](https://github.com/mass-adoption/vircle/compare/cafe24-v0.0.2...cafe24-v0.0.4) (2022-09-13)


### Features

* 상품 사진 이미지를 다운로드 하여 등록 ([#128](https://github.com/mass-adoption/vircle/issues/128)) ([9da61b9](https://github.com/mass-adoption/vircle/commit/9da61b9576a3a57fad544612d37d35641d0cdb99))
* **cafe24:** :rocket: 보증서 발급 이벤트 데이터(dynamodb)에 product 정보를 추가 ([#116](https://github.com/mass-adoption/vircle/issues/116)) ([0f4fb4f](https://github.com/mass-adoption/vircle/commit/0f4fb4f0001de49ce59e37ac04efda963ec79df4))
* **cafe24:** :zap: cafe24 연동 여부 확인 비지니스 로직 변경 ([#113](https://github.com/mass-adoption/vircle/issues/113)) ([bfe8962](https://github.com/mass-adoption/vircle/commit/bfe89627faf3ab76c4127c09104f9d31c28078b1))
* **cafe24:** batch 주문을 처리하도록 설정 ([#125](https://github.com/mass-adoption/vircle/issues/125)) ([dddfa42](https://github.com/mass-adoption/vircle/commit/dddfa425d2d1a44f50cec060fd2916d0bd2826db))
* **cafe24:** buffer 형태로 이미지를 업로드 ([#129](https://github.com/mass-adoption/vircle/issues/129)) ([9b4dc98](https://github.com/mass-adoption/vircle/commit/9b4dc98d5c923e5f28ac94e298cbbcacc8c47fda))
* **common:** ⚡ vircle common 프로젝트 init ([#106](https://github.com/mass-adoption/vircle/issues/106)) ([0ba6e5d](https://github.com/mass-adoption/vircle/commit/0ba6e5d4424c7dd01d650df70ad2dde75c371001))


### Bug Fixes

* **cafe24:** :ambulance: jwt guard가 동작 에러 해결 ([#112](https://github.com/mass-adoption/vircle/issues/112)) ([c2eeae4](https://github.com/mass-adoption/vircle/commit/c2eeae4d73408e0322f6ff4a66fa91a5353cf43c))
* **cafe24:** :ambulance: routing 에러 수정 ([#111](https://github.com/mass-adoption/vircle/issues/111)) ([4446ed3](https://github.com/mass-adoption/vircle/commit/4446ed3986a54117f35aafd15079dd6c28de6867))
* **cafe24:** 연동을 해제한 사람의 연동 데이터가 조회되는 문제 해결 ([#124](https://github.com/mass-adoption/vircle/issues/124)) ([f85f620](https://github.com/mass-adoption/vircle/commit/f85f620db0e88ea2c4324bb3fe396eaccc17301f))
* **cafe24:** after.install.sh에 있는 syntax error 수정 ([#110](https://github.com/mass-adoption/vircle/issues/110)) ([ba6be22](https://github.com/mass-adoption/vircle/commit/ba6be22b69366b72ba2b7456e6c401ee0d678a0a))
* **cafe24:** appspec script location error ([#118](https://github.com/mass-adoption/vircle/issues/118)) ([06ba246](https://github.com/mass-adoption/vircle/commit/06ba24632d5a2318be70eb34afd07f13f759eb11))
* **cafe24:** orderId 파싱에러 수정 ([#126](https://github.com/mass-adoption/vircle/issues/126)) ([041c906](https://github.com/mass-adoption/vircle/commit/041c9063c4d6324aea8c78c86bd14c21b45f405a))
* **cafe24:** orderId가 이상하게 저장되는 문제 해결 ([#127](https://github.com/mass-adoption/vircle/issues/127)) ([3b39810](https://github.com/mass-adoption/vircle/commit/3b39810de79509cfe6529ba4d5e925b45ca6711f))
* **cafe24:** partnerInfo에서 brand의 nullsafe 처리 ([#122](https://github.com/mass-adoption/vircle/issues/122)) ([b7e319e](https://github.com/mass-adoption/vircle/commit/b7e319ee90682f357246313a906aef46ee5c24fd))

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
