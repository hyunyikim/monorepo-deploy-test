import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import {Stack, Typography} from '@mui/material';

import {GauranteeDetailResponse} from '@/@types';
import {getGuaranteeDetail} from '@/api/guarantee.api';
import {PAGE_MAX_WIDTH} from '@/data';
import {goToParentUrl, usePageView} from '@/utils';
import {useGetPartnershipInfo, useMessageDialog} from '@/stores';

import GuaranteeRegisterForm from '@/features/guarantee/Register/GuaranteeRegisterForm';
import GuaranteePreviewCard from '@/features/guarantee/Register/GuaranteePreviewCard';
import {Button} from '@/components';

function GuaranteeRegister() {
	usePageView('guarantee_publish_pv', '개런티발급 노출');
	const params = useParams();
	const idx = params?.idx;

	const [data, setData] = useState<GauranteeDetailResponse | null>(null);
	const {data: partnershipInfo} = useGetPartnershipInfo();
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);

	useEffect(() => {
		(async () => {
			if (!idx) {
				return;
			}
			const res = await getGuaranteeDetail(Number(idx));
			setData(res);
		})();
	}, [idx]);

	useEffect(() => {
		const idx = partnershipInfo?.idx;
		const profileImage = partnershipInfo?.profileImage;
		const isSetupGuarantee = profileImage ? true : false;

		// 데이터 호출 전
		if (!idx) {
			return;
		}
		if (isSetupGuarantee) {
			return;
		}

		// 개런티 최초 설정 요청
		onOpenMessageDialog({
			title: '개런티 설정 후 개런티 등록이 가능합니다.',
			showBottomCloseButton: false,
			buttons: (
				<>
					<Button
						color="black"
						variant="contained"
						onClick={() => {
							goToParentUrl('/setup/guarantee');
						}}>
						확인
					</Button>
				</>
			),
			onCloseFunc: () => {
				goToParentUrl('/setup/guarantee');
			},
		});
	}, [onOpenMessageDialog, partnershipInfo]);

	return (
		<Stack
			justifyContent="center"
			flexDirection={{
				xs: 'column',
				md: 'row',
			}}>
			<Stack
				flexDirection="column"
				width="100%"
				maxWidth={PAGE_MAX_WIDTH}
				marginRight={{
					xs: 'auto',
					md: '40px',
				}}
				marginLeft={{
					xs: 'auto',
					md: '0',
				}}
				mb="60px">
				<Typography
					variant="h1"
					fontSize={28}
					fontWeight={700}
					mb="40px">
					개런티 발급하기
				</Typography>
				<GuaranteeRegisterForm initialData={data} />
			</Stack>
			<GuaranteePreviewCard />
		</Stack>
	);
}

export default GuaranteeRegister;
