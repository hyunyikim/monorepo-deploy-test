import {useEffect, useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';

import {Stack, Typography} from '@mui/material';

import ProductRegisterForm from '@/features/product/Register/ProductRegisterForm';
import {ProductDetailResponse} from '@/@types';
import {getProductDetail} from '@/api/product.api';
import {PAGE_MAX_WIDTH} from '@/data';
import {usePageView} from '@/utils';

function ProductRegister() {
	usePageView('itemadmin_regist_pv', '상품등록 화면 진입');
	const params = useParams();
	const idx = params?.idx;

	const [data, setData] = useState<ProductDetailResponse | null>(null);

	useEffect(() => {
		(async () => {
			if (!idx) {
				return;
			}
			const res = await getProductDetail(Number(idx));
			setData(res);
		})();
	}, [idx]);

	const formControlMode = useMemo(() => (idx ? 'edit' : 'register'), [idx]);

	return (
		<Stack flexDirection="column" maxWidth={PAGE_MAX_WIDTH} margin="auto">
			<Typography variant="h1" fontSize={28} fontWeight={700} mb="40px">
				{`상품 ${formControlMode === 'register' ? '등록' : '수정'}하기`}
			</Typography>
			<ProductRegisterForm mode={formControlMode} initialData={data} />
		</Stack>
	);
}

export default ProductRegister;
