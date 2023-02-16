import {useParams} from 'react-router-dom';
import {useGetProductDetail} from '@/stores';

import {ContentWrapper} from '@/components';
import ProductDetailInfo from './ProductDetailInfo';
import ProductGuaranteeTable from './ProductGuaranteeTable';

function ProductDetail() {
	const {idx} = useParams();
	const {data} = useGetProductDetail(Number(idx));
	return (
		<ContentWrapper fullWidth={true}>
			{data && <ProductDetailInfo data={data} />}
			{idx && <ProductGuaranteeTable idx={Number(idx)} />}
		</ContentWrapper>
	);
}

export default ProductDetail;
