import {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';

import {deleteGuarantee} from '@/api/guarantee-v1.api';
import {useMessageDialog} from '@/stores';
import {sendAmplitudeLog} from '@/utils';

import {Button} from '@/components';

interface Props {
	idx?: number;
}

function GuaranteeDeleteButton({idx}: Props) {
	const navigate = useNavigate();
	const onOpenError = useMessageDialog((state) => state.onOpenError);
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);

	const handleDeleteGuarantee = useCallback(() => {
		if (!idx) {
			return;
		}
		sendAmplitudeLog('guarantee_publish_delete_popupview', {
			button_title: '삭제하시겠습니까? 팝업노출',
		});
		onOpenMessageDialog({
			title: '개런티를 삭제하시겠습니까?',
			showBottomCloseButton: true,
			closeButtonValue: '취소',
			buttons: (
				<>
					<Button
						color="black"
						variant="contained"
						onClick={async () => {
							try {
								await deleteGuarantee(idx);
								onOpenMessageDialog({
									title: '개런티를 삭제했습니다',
									showBottomCloseButton: true,
									onCloseFunc: () => {
										navigate('/b2b/guarantee', {
											replace: true,
										});
									},
								});
							} catch (e: any) {
								onOpenError();
							} finally {
								sendAmplitudeLog('guarantee_publish_delete');
							}
						}}
						data-tracking={`guarantee_publish_delete_popupdelete_click,{'button_title': '삭제하기 클릭 시 삭제'}`}>
						삭제
					</Button>
				</>
			),
		});
	}, [idx]);

	return (
		<Button
			variant="outlined"
			color="grey-100"
			height={48}
			onClick={() => {
				handleDeleteGuarantee();
			}}
			data-tracking={`guarantee_publish_delete_click,{'button_title': '삭제 클릭'}`}>
			삭제
		</Button>
	);
}

export default GuaranteeDeleteButton;
