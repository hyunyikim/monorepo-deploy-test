import {useLocation} from 'react-router-dom';

import {Stack} from '@mui/material';

import {cancelGuarantee} from '@/api/guarantee.api';
import {useMessageDialog} from '@/stores';
import {goToParentUrl, goBack} from '@/utils';

import {Button} from '@/components';

function GuaranteeCancelButton({idx}: {idx: number}) {
	const location = useLocation();
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	return (
		<Stack alignItems="center" mt="24px">
			<Button
				height={32}
				width={88}
				variant="outlined"
				color="grey-100"
				data-tracking={`guarantee_detail_cencle_click,{'button_title': '발급취소 클릭'}`}
				onClick={() => {
					onOpenMessageDialog({
						title: '개런티를 발급 취소하시겠습니까?',
						showBottomCloseButton: true,
						buttons: (
							<>
								<Button
									color="black"
									onClick={() => {
										(async () => {
											try {
												await cancelGuarantee(idx);
												onOpenMessageDialog({
													title: '개런티 발급이 취소되었습니다.',
													showBottomCloseButton: true,
													onCloseFunc: () => {
														// 고객 상세 페이지에서 넘어온 경우, 개런티 발급 취소 후 고객 목록 페이지로 이동 시킴
														const search =
															location.search;
														if (
															search.includes(
																'name'
															) &&
															search.includes(
																'phone'
															)
														) {
															goToParentUrl(
																'/b2b/customer'
															);
															return;
														}
														goBack();
													},
												});
											} catch (e: any) {
												onOpenMessageDialog({
													title: '네트워크 에러',
													message:
														e?.response?.data
															?.message || '',
													showBottomCloseButton: true,
												});
											}
										})();
									}}>
									삭제
								</Button>
							</>
						),
					});
				}}>
				발급취소
			</Button>
		</Stack>
	);
}

export default GuaranteeCancelButton;
