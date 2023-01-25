import {useParams} from 'react-router-dom';
import {useGetProductDetail} from '@/stores';

import {ContentWrapper} from '@/components';
import ProductDetailInfo from './ProductDetailInfo';

function ProductDetail() {
	const {idx} = useParams();
	const {data} = useGetProductDetail(Number(idx));
	return (
		<ContentWrapper fullWidth={true}>
			{data && <ProductDetailInfo data={data} />}
		</ContentWrapper>
	);
}

export default ProductDetail;
