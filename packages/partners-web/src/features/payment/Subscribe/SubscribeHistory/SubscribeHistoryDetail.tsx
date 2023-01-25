import {useNavigate} from 'react-router-dom';

import style from '@/assets/styles/style.module.scss';

import {Stack, Typography} from '@mui/material';
import {IcPrinter} from '@/assets/icon';
import Breadcrumbs from '@/features/payment/common/Breadcrumbs';
import SubscribeInfoPreview from '@/features/payment/common/SubscribeInfoPreview';
import SubscribeNoticeBullet from '../../common/SubscribeNoticeBullet';

interface Props {
	idx: number;
}

function SubscribeHistoryDetail({idx}: Props) {
	const navigate = useNavigate();
	return (
		<Stack
			sx={{
				margin: '40px auto',
				maxWidth: '346px',
			}}>
			<Stack flexDirection="row" justifyContent="space-between" mb="20px">
				<Breadcrumbs
					beforeList={[
						{
							name: '구독내역',
							onClick: () => {
								navigate(-1);
							},
						},
					]}
					now="Breadcrumbs"
				/>
				<Typography
					variant="body3"
					fontWeight="bold"
					color="primary.main"
					className="flex-center cursor-pointer">
					<IcPrinter
						width={16}
						height={16}
						color={style.virclePrimary500}
						style={{
							marginRight: '4px',
						}}
					/>
					인쇄
				</Typography>
			</Stack>
			<SubscribeInfoPreview
				sx={{
					maxWidth: 'none',
				}}
			/>
			<SubscribeNoticeBullet
				data={[
					'업그레이드 시 기존 개런티 발급량이 남아 있다면 업그레이드한 플랜에 함께 적용됩니다.',
					'환불은 카드취소가 불가능할 경우 고객센터를 통해 문의 주시면 사용일수를 계산해 지정계좌로 입금 해드립니다.',
					'연결제 이용중 플랜의 구독을 취소하거나 다운그레이드 할 경우에는 위약금 규정에 따라 위약금을 공제 후 차액을 환불 해드립니다.',
				]}
			/>
		</Stack>
	);
}

export default SubscribeHistoryDetail;
