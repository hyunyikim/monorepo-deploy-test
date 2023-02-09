import {useMemo} from 'react';
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
			payPrice,
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
				totalPrice: pricePlan.displayTotalPrice,
			},
			...(canceledPricePlan && {
				canceledData: {
					planName: canceledPricePlan.planName,
					displayTotalPrice: canceledPricePlan.displayTotalPrice,
					subscribeDuration: `${format(
						new Date(canceledPricePlan.startedAt),
						DATE_FORMAT_SEPERATOR_DOT
					)} - ${format(
						new Date(canceledPricePlan.finishedAt),
						DATE_FORMAT_SEPERATOR_DOT
					)}`,
					usedPayPrice: `₩${(
						canceledPricePlan.displayPrice || 0
					).toLocaleString()} X ${canceledPricePlan.usedMonths}개월`,
					totalPrice: (canceledPricePlan?.canceledPrice || 0) / 1.1,
				},
			}),
			...(payPrice && {
				finalTotalPrice: payPrice,
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
			<SubscribeNoticeBullet />
		</Stack>
	);
}

export default SubscribeHistoryDetail;
