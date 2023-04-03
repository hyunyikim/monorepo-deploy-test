import {useEffect, useMemo} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

import ProductRegisterForm from '@/features/product/Register/ProductRegisterForm';
import {PAGE_MAX_WIDTH} from '@/data';
import {usePageView} from '@/utils';
import {
	useGetPartnershipInfo,
	useGetProductDetail,
	useMessageDialog,
} from '@/stores';

import {ContentWrapper, TitleTypography} from '@/components';

function ProductRegister() {
	usePageView('itemadmin_regist_pv', '상품등록 화면 진입');
	const params = useParams();
	const navigate = useNavigate();
	const idx = params?.idx;

	const {data: partnershipInfo} = useGetPartnershipInfo();
	const {data} = useGetProductDetail(Number(idx));
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);

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
			title: '개런티 설정 후 상품 등록이 가능합니다.',
			showBottomCloseButton: true,
			closeButtonValue: '확인',
			onCloseFunc: () => {
				navigate('/setup/guarantee');
			},
		});
	}, [onOpenMessageDialog, partnershipInfo]);

	const formControlMode = useMemo(() => (idx ? 'edit' : 'register'), [idx]);

	return (
		<ContentWrapper maxWidth={PAGE_MAX_WIDTH}>
			<TitleTypography
				title={`상품 ${
					formControlMode === 'register' ? '등록' : '수정'
				}하기`}
			/>
			<ProductRegisterForm
				mode={formControlMode}
				initialData={data || null}
			/>
		</ContentWrapper>
	);
}

export default ProductRegister;
