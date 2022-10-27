import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';

import {KaKaoAlimTalkApi} from './kakao-alim-talk-api/kakao-alim-talk-api';
import {KakaoAlimTalkService} from './kakao-alim-talk.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath:
				process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
	],
	providers: [
		{
			provide: KaKaoAlimTalkApi,
			useFactory: (configService: ConfigService) => {
				const appKey = configService.getOrThrow<string>(
					'KAKAO_BIZ_B2B_APPKEY'
				);
				const secretKey = configService.getOrThrow<string>(
					'KAKAO_BIZ_B2B_SECRETKEY'
				);
				const senderKey = configService.getOrThrow<string>(
					'KAKAO_BIZ_SENDERKEY'
				);

				return new KaKaoAlimTalkApi(senderKey, {appKey, secretKey});
			},
			inject: [ConfigService],
		},
		KakaoAlimTalkService,
	],
	exports: [KakaoAlimTalkService, KaKaoAlimTalkApi],
})
export class KakaoAlimTalkModule {}
