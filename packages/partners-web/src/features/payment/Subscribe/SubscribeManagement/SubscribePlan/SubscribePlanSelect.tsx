import {Dispatch, SetStateAction, useCallback, useMemo} from 'react';

import {Backdrop, Stack, Typography} from '@mui/material';

import {PricePlan} from '@/@types';
import {useOpen} from '@/utils/hooks';
import style from '@/assets/styles/style.module.scss';
import {ENTERPRISE_PLAN, getChargedPlanDescription} from '@/data';
import {useGetPricePlanListByPlanType} from '@/stores';

import {IcChevronDown} from '@/assets/icon';
import {Button, IntroductionInquiryDialog} from '@/components';

interface Props {
	selectOpen: boolean;
	setSelectOpen: Dispatch<SetStateAction<boolean>>;
	selectedPlan: PricePlan;
	onChangePlan: (value: PricePlan) => void;
}

function SubscribePlanSelect({
	selectOpen,
	setSelectOpen,
	selectedPlan,
	onChangePlan,
}: Props) {
	const {data: yearPlanList} = useGetPricePlanListByPlanType('YEAR');
	const {data: monthPlanList} = useGetPricePlanListByPlanType('MONTH');

	const {
		open: modalOpen,
		onOpen: onModalOpen,
		onClose: onModalClose,
	} = useOpen({});

	const onSelect = useCallback(
		(value: PricePlan) => {
			onChangePlan(value);
			setSelectOpen(false);
		},
		[onChangePlan]
	);

	const selectedPlanList = useMemo(() => {
		if (selectedPlan?.planType === 'MONTH') {
			return monthPlanList;
		}
		return yearPlanList;
	}, [selectedPlan, yearPlanList, monthPlanList]);

	if (!yearPlanList || !monthPlanList) {
		return <></>;
	}

	return (
		<>
			<Stack
				sx={{
					position: 'relative',
				}}>
				<SubscribePlanSelectSelected
					selectOpen={selectOpen}
					selectedPlan={selectedPlan}
					onClick={() => {
						setSelectOpen((prev) => !prev);
					}}
					onModalOpen={onModalOpen}
				/>
				<Stack
					sx={{
						paddingY: '6px',
						paddingX: '16px',
						backgroundColor: 'grey.700',
						borderRadius: '8px',
						boxShadow: '0px 4px 6px 0px #00000033',
						position: 'absolute',
						zIndex: 1,
						width: '100%',
						top: '74px',
						visibility: selectOpen ? 'visible' : 'hidden',
						opacity: selectOpen ? 1 : 0,
						transition: 'visibility, opacity linear 100ms',
					}}>
					{selectedPlanList &&
						selectedPlanList.map((plan) => (
							<SubscribePlanSelectItem
								key={plan.planLevel}
								plan={plan}
								onSelect={onSelect}
								onModalOpen={onModalOpen}
							/>
						))}
					<SubscribePlanSelectItem
						enterprisePlan={{
							planName: ENTERPRISE_PLAN.PLAN_NAME,
							planDesc: ENTERPRISE_PLAN.PLAN_DESCRIPTION,
						}}
						onModalOpen={onModalOpen}
					/>
				</Stack>
				<Backdrop
					open={selectOpen}
					onClick={() => setSelectOpen(false)}
					invisible
				/>
			</Stack>
			<IntroductionInquiryDialog
				open={modalOpen}
				onClose={onModalClose}
				target="new"
			/>
		</>
	);
}

const SubscribePlanSelectSelected = ({
	selectOpen,
	selectedPlan,
	onClick,
	onModalOpen,
}: {
	selectOpen: boolean;
	selectedPlan: PricePlan;
	onClick: () => void;
	onModalOpen: () => void;
}) => {
	return (
		<Stack
			flexDirection="row"
			justifyContent="space-between"
			sx={{
				padding: '14px 16px',
				borderRadius: '8px',
				transition: 'all 100ms ease-in-out',
				backgroundColor: 'grey.900',
				border: (theme) => `1px solid ${theme.palette.grey[900]}`,
				color: 'white',
				'& .subcribe-plan-desc': {
					color: 'green.main',
				},
			}}
			className="cursor-pointer"
			onClick={onClick}>
			<Stack>
				<Typography
					variant="body3"
					fontWeight="bold"
					color={'white'}
					mb="4px">
					{selectedPlan.planName}
				</Typography>
				<Typography
					className="subcribe-plan-desc"
					variant="caption3"
					color="green.main">
					{getChargedPlanDescription(selectedPlan.planLimit)}
				</Typography>
			</Stack>
			<Stack
				flexDirection="row"
				justifyContent="flex-end"
				alignItems="center">
				<Typography
					variant="body3"
					fontWeight="bold"
					color="white"
					mr=" 2px">
					₩{selectedPlan?.displayPrice?.toLocaleString() || ''}
				</Typography>
				<Typography variant="caption3" color="white" mr="8px">
					월
				</Typography>
				<IcChevronDown
					width={18}
					height={18}
					color={style.vircleGrey400}
					style={{
						transform: selectOpen ? 'rotate(-180deg)' : 'rotate(0)',
						transition: 'transform 0.25s ease-in-out',
					}}
				/>
			</Stack>
		</Stack>
	);
};

const SubscribePlanSelectItem = ({
	plan,
	enterprisePlan,
	onSelect,
	onModalOpen,
}: {
	plan?: PricePlan;
	enterprisePlan?: {
		planName: string;
		planDesc: string;
	};
	onSelect?: (value: PricePlan) => void;
	onModalOpen: () => void;
}) => {
	return (
		<Stack
			flexDirection="row"
			justifyContent="space-between"
			sx={{
				paddingY: '6px',
			}}
			className="cursor-pointer"
			onClick={() => {
				if (plan && onSelect) {
					onSelect(plan);
				}
			}}>
			<Stack>
				<Typography
					variant="body3"
					fontWeight="bold"
					color="white"
					mb="4px">
					{enterprisePlan?.planName || plan?.planName}
				</Typography>
				<Typography variant="caption3" color="grey.300">
					{enterprisePlan?.planDesc ||
						(plan && getChargedPlanDescription(plan.planLimit))}
				</Typography>
			</Stack>
			<Stack flexDirection="row" alignItems="center">
				{enterprisePlan ? (
					<InquiryButton onOpen={onModalOpen} />
				) : (
					<>
						<Typography
							variant="body3"
							fontWeight="bold"
							color="white"
							mr=" 2px">
							{`₩${
								(plan &&
									plan?.displayPrice?.toLocaleString()) ||
								''
							}`}
						</Typography>
						<Typography variant="caption3" color="white">
							월
						</Typography>
					</>
				)}
			</Stack>
		</Stack>
	);
};

const InquiryButton = ({onOpen}: {onOpen: () => void}) => {
	return (
		<>
			<Button
				variant="outlined"
				color="grey-100"
				height={32}
				onClick={(e) => {
					e.stopPropagation();
					onOpen();
				}}>
				도입문의
			</Button>
		</>
	);
};

export default SubscribePlanSelect;
