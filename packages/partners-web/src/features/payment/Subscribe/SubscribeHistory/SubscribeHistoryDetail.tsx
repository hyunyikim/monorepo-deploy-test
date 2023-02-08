import {useEffect, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {format} from 'date-fns';

import style from '@/assets/styles/style.module.scss';

import {Stack, Typography} from '@mui/material';

import {useGetUserPaymentHistoryDetail} from '@/stores';
import {TotalSubscribeInfoPreviewData} from '@/@types';
import {DATE_FORMAT_SEPERATOR_DOT} from '@/data';

import {IcPrinter} from '@/assets/icon';
import Breadcrumbs from '@/features/payment/common/Breadcrumbs';
import SubscribeInfoPreview from '@/features/payment/common/SubscribeInfoPreview';
import SubscribeNoticeBullet from '@/features/payment/common/SubscribeNoticeBullet';

interface Props {
	idx: string;
}

function SubscribeHistoryDetail({idx}: Props) {
	const navigate = useNavigate();
	const {data} = useGetUserPaymentHistoryDetail(idx);

	const previewData = useMemo<TotalSubscribeInfoPreviewData | null>(() => {
		if (!data) {
			return null;
		}
		const {
			planName,
			startDate,
			expireDate,
			pricePlan,
			canceledPricePlan,
			payApprovedAt,
			totalPaidPrice,
		} = data;

		const res: TotalSubscribeInfoPreviewData = {
			data: {
				planName,
				displayTotalPrice: pricePlan.displayTotalPrice,
				planTotalPrice: pricePlan.planTotalPrice,
				...(pricePlan.discountTotalPrice && {
					discountTotalPrice: pricePlan.discountTotalPrice,
				}),
				subscribeDuration: `${format(
					new Date(startDate),
					DATE_FORMAT_SEPERATOR_DOT
				)} - ${format(
					new Date(expireDate),
					DATE_FORMAT_SEPERATOR_DOT
				)}`,
				payApprovedAt: format(
					new Date(payApprovedAt),
					DATE_FORMAT_SEPERATOR_DOT
				),
			},
			...(canceledPricePlan && {
				canceledData: {
					planName: canceledPricePlan.planName,
					displayTotalPrice: canceledPricePlan.displayTotalPrice,
					planTotalPrice: canceledPricePlan.planTotalPrice,
					...(canceledPricePlan.discountTotalPrice && {
						discountTotalPrice:
							canceledPricePlan.discountTotalPrice,
					}),
					subscribeDuration: `${format(
						new Date(startDate),
						DATE_FORMAT_SEPERATOR_DOT
					)} - ${expireDate}`,
				},
			}),
			...(totalPaidPrice && {
				totalPaidPrice,
			}),
		};
		return res;
	}, [data]);

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
					now={data?.displayOrderId || ''}
				/>
				<Typography
					variant="body3"
					fontWeight="bold"
					color="primary.main"
					className="flex-center cursor-pointer"
					onClick={() => {
						window.print();
					}}>
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
			{previewData && (
				<SubscribeInfoPreview
					data={previewData}
					sx={{
						maxWidth: 'none',
					}}
				/>
			)}
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
