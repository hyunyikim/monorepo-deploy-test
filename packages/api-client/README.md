# api-client

## structure

```
vircleClient.{domain}.{resource}.{method}
```

### domain

domain은 vircle service의 특정 도메인을 의미합니다. (단 core는)

### resource

resource는 특정 domain에 종속된 개념입니다. resource는 api에서 취급하게 되는 정보의 단위 이기도 합니다.

### method

method는 특정 서비스의 메서드에 매칭 됩니다.

## Example

```typescript
import {ApiClient, ApiClientOption} from '@vircle/api-client';

const option: ApiClientOption = {
	token: 'LK32IJ32342D3S1212SDASDF',
	vircleApiUrl: 'api.vircle.co.kr',
};

const client = new ApiClient(option);

const interwork = client.cafe24.interwork.getByMallId('massadoption', {
	token: 'SJIELKWIEJPDKJLSKDFBKLSIE',
});
```
