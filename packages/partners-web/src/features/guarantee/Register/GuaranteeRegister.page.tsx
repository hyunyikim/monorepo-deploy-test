import {useEffect, useState} from 'react';
import {useLocation, useParams, useNavigate} from 'react-router-dom';
import {parse} from 'qs';

import {Stack} from '@mui/material';

import {GuaranteeDetail, ProductDetailResponse} from '@/@types';
import {getGuaranteeDetail} from '@/api/guarantee-v1.api';
import {PAGE_MAX_WIDTH} from '@/data';
import {usePageView} from '@/utils';
import {
	useGetGuaranteeSettingCompleted,
	useGetPartnershipInfo,
	useMessageDialog,
} from '@/stores';

import GuaranteeRegisterForm from '@/features/guarantee/Register/GuaranteeRegisterForm';
import GuaranteeRegisterPreviewCard from '@/features/guarantee/Register/GuaranteeRegisterPreviewCard';
import {TitleTypography} from '@/components';
import {getProductDetail} from '@/api/product.api';

function GuaranteeRegister() {
	usePageView('guarantee_publish_pv', '개런티발급 노출');
	const params = useParams();
	const {search} = useLocation();
	const navigate = useNavigate();
	const idx = params?.idx;

	const productIdx = parse(search, {
		ignoreQueryPrefix: true,
	})?.productIdx;

	const [data, setData] = useState<GuaranteeDetail | null>(null);
	const [product, setProduct] = useState<ProductDetailResponse | null>(null);
	const {data: partnershipInfo} = useGetPartnershipInfo();
	const {data: isSettingCompleted} = useGetGuaranteeSettingCompleted();

	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);

	// 임시저장 상태 개런티 수정
	useEffect(() => {
		(async () => {
			if (!idx) {
				return;
			}
			const res = await getGuaranteeDetail(Number(idx));
			setData(res);
		})();
	}, [idx]);

	// 상품 상세에서 개런티 발급으로 넘어온 경우
	useEffect(() => {
		(async () => {
			if (!productIdx) {
				return;
			}
			const res = await getProductDetail(Number(productIdx));
			setProduct(res);
		})();
	}, [productIdx]);

	useEffect(() => {
		const idx = partnershipInfo?.idx;

		// 데이터 호출 전
		if (!idx) {
			return;
		}
		if (isSettingCompleted) {
			return;
		}

		// 개런티 최초 설정 요청
		onOpenMessageDialog({
			title: '개런티 설정 후 개런티 등록이 가능합니다.',
			showBottomCloseButton: true,
			closeButtonValue: '확인',
			onCloseFunc: () => {
				navigate('/setup/guarantee');
			},
		});
	}, [onOpenMessageDialog, partnershipInfo, isSettingCompleted]);

	return (
		<Stack
			justifyContent="center"
			flexDirection={{
				xs: 'column',
				md: 'row',
			}}
			p={5}>
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
				mb={{
					xs: '60px',
					md: '100px',
				}}>
				<TitleTypography title="개런티 발급하기" />
				<GuaranteeRegisterForm initialData={data} product={product} />
			</Stack>
			<GuaranteeRegisterPreviewCard />
		</Stack>
	);
}

export default GuaranteeRegister;
