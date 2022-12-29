import {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {AsyncState} from 'react-use/lib/useAsyncFn';

import {sendAmplitudeLog, goToParentUrl} from '@/utils';
import {useChildModalOpen} from '@/utils/hooks';

import {Button} from '@/components';
import {ImgRobotConnectCafe24, ImgRobotConnectCafe242x} from '@/assets/images';
import RobotModal from '@/features/common/RobotModal';

interface Props {
	cafe24State?: AsyncState<boolean>;
}

function Cafe24StartRobotModal({cafe24State}: Props) {
	const location = useLocation();
	const navigate = useNavigate();

	const {open, onOpen, onClose} = useChildModalOpen({
		handleOpen: () => {
			sendAmplitudeLog('cafe24_stratpopupview', {
				pv_title: '카페24 연동시작 팝업',
			});
		},
	});

	useEffect(() => {
		// cafe24 연동 완료 팝업 띄움
		// 연동 페이지에서 넘어오고, 2차로 cafe24에 연동된 내역 있는지 확인
		if (location?.state?.connectCafe24 && cafe24State?.value) {
			navigate(`${location.pathname}${location.search}`, {
				replace: true,
				state: null,
			});
			onOpen();
		}
	}, [onOpen, location, cafe24State?.value]);

	return (
		<RobotModal
			open={open}
			onClose={onClose}
			title="CAFE24 연동이 완료되었어요!"
			subTitle="개런티 발급할 상품과 발급시점은 설정에서 변경할 수 있어요."
			useLottieAnimation={true}
			ActionComponent={
				<Button
					height={60}
					width="400px"
					data-tracking={`'cafe24_complate_setting_click', {button_title: '설정하기'}`}
					onClick={() => {
						goToParentUrl('/b2b/interwork/cafe24');
					}}>
					설정하기
				</Button>
			}>
			<img
				src={ImgRobotConnectCafe24}
				srcSet={`${ImgRobotConnectCafe24} 1x, ${ImgRobotConnectCafe242x} 2x`}
			/>
		</RobotModal>
	);
}

export default Cafe24StartRobotModal;
