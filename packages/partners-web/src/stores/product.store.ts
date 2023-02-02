import {useQuery} from '@tanstack/react-query';

import {getProductDetail} from '@/api/product.api';
import {useMessageDialog} from './ui.store';
import {useNavigate} from 'react-router-dom';

export const useGetProductDetail = (idx?: number) => {
	const navigate = useNavigate();
	const onMessageDialogOpen = useMessageDialog((state) => state.onOpen);
	return useQuery({
		queryKey: ['getProductDetail', idx],
		queryFn: () => (idx ? getProductDetail(idx) : null),
		onError: () => {
			onMessageDialogOpen({
				title: '존재하지 않는 상품입니다.',
				showBottomCloseButton: true,
				closeButtonValue: '확인',
				onCloseFunc: () => {
					navigate(-1);
				},
			});
		},
	});
};
