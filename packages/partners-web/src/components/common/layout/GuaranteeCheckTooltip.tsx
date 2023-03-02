import {IcClose, IcInformation} from '@/assets/icon';
import {isPlanEnterprise} from '@/data';
import {useGetUserPricePlan, useIsPlanOnSubscription} from '@/stores';
import {Box, Typography} from '@mui/material';
import {format} from 'date-fns';
import {useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';

const GuaranteeCheckTooltip = () => {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(true);
	const {data: userPricePlan} = useGetUserPricePlan();
	const {data: isOnSubscription} = useIsPlanOnSubscription();

	const closeHandler = () => {
		setIsOpen((pre) => !pre);
	};

	const goToPricePlan = () => {
		navigate('/b2b/payment/subscribe');
	};

	const headerInfo = useMemo(() => {
		if (!userPricePlan) {
			return null;
		}

		const {pricePlan, nextPricePlan, usedNftCount, planExpireDate} =
			userPricePlan;

		const planLimit = pricePlan.planLimit;
		const isExpired = !isOnSubscription;
		const isFreePlan = pricePlan.planLevel === 0;
		const usedAllCredit =
			usedNftCount === planLimit || usedNftCount > planLimit;
		const expireDate = planExpireDate
			? format(planExpireDate, 'yyyy년 MM월 dd일')
			: '';
		const isUnder30percent =
			Math.ceil(planLimit * 0.3) >= planLimit - usedNftCount;
		const isEnterprise = isPlanEnterprise(pricePlan?.planType);
		if (isEnterprise) {
			return null;
		}

		// 무료플랜에서
		if (isFreePlan) {
			// 기간 만료
			if (isExpired) {
				return {
					content: [
						`플랜 구독하고 개런티를 계속 발급해보세요.`,
						'플랜 구독하기',
					],
					color: 'red.50',
					icColor: '#F8434E',
				};
			}

			// 개런티 모두 소진
			if (usedAllCredit) {
				return {
					content: [
						`플랜 구독하고 개런티를 계속 발급해보세요.`,
						'플랜 구독하기',
					],
					color: 'red.50',
					icColor: '#F8434E',
				};
			}

			// 이용중
			return {
				content: [
					`무료 체험 기간이 ${expireDate}일에 종료됩니다. 체험 기간이 종료되면 기능이 제한돼요.`,
				],
				color: 'red.50',
				icColor: '#F8434E',
			};
		} else {
			// 유료플랜에서
			if (isExpired || (!nextPricePlan && planExpireDate)) {
				// 플랜 만료 || 유료플랜 구독 취소
				return {
					content: [
						`플랜 구독하고 개런티를 계속 발급해보세요.`,
						'플랜 구독하기',
					],
					color: 'red.50',
					icColor: '#F8434E',
				};
			}

			/* 개런티 발급량이 0 이하 일때 */
			if (usedAllCredit) {
				return {
					content: [
						`플랜 업그레이드하고 개런티를 계속 발급해보세요.`,
						'플랜 업그레이드',
					],
					color: 'red.50',
					icColor: '#F8434E',
				};
			}

			// 개런티 발급량 30퍼센트 남음
			if (isUnder30percent) {
				return {
					content: [
						`개런티 발급량이 얼마 남지 않았네요! 플랜 업그레이드를 권장드려요.`,
						'플랜 업그레이드',
					],
					color: 'primary.50',
					icColor: '#526EFF',
				};
			}
		}
		return null;
	}, [userPricePlan, isOnSubscription]);

	if (!isOpen || !headerInfo) {
		return null;
	}
	return (
		<Box
			sx={{
				display: {
					xs: 'none',
					md: 'flex',
				},
				backgroundColor: headerInfo.color,
				borderRadius: '4px',
				color: 'grey.900',
				fontSize: '13px',
				lineHeight: '19px',
				fontWeight: 500,
				padding: '8px 12px',
				marginRight: '16px',
				marginLeft: '32px',
			}}>
			<IcInformation
				width={16}
				height={16}
				color={headerInfo.icColor}
				style={{
					display: 'block',
					minWidth: '16px',
					minHeight: '16px',
				}}
			/>
			<Box
				sx={{
					marginRight: '12px',
					marginLeft: '8px',
					wordBreak: 'keep-all',
					display: 'flex',
					flexWrap: 'wrap',
				}}>
				{headerInfo.content.map((item, idx) => {
					if (idx === 0) {
						return (
							<Typography
								sx={{fontWeight: 500, fontSize: '13px'}}>
								{item}
							</Typography>
						);
					}
					if (idx === 1) {
						return (
							<Typography
								color={headerInfo.icColor}
								sx={{
									fontWeight: 500,
									fontSize: '13px',
									cursor: 'pointer',
									marginLeft: '4px',
								}}
								onClick={goToPricePlan}>
								{item} {'>'}
							</Typography>
						);
					}
				})}
			</Box>
			<IcClose
				width={16}
				height={16}
				color={headerInfo.icColor}
				style={{
					display: 'block',
					minWidth: '16px',
					minHeight: '16px',
				}}
				onClick={closeHandler}
			/>
		</Box>
	);
};

export default GuaranteeCheckTooltip;
