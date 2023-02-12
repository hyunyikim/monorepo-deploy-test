import {Suspense} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {parse, stringify} from 'qs';

import {Link, Stack, Typography, Skeleton} from '@mui/material';

import {ContentWrapper, Tab} from '@/components';
import {useTabQueryParam} from '@/utils/hooks';

import SubscribeManagementTab from '@/features/payment/Subscribe/SubscribeManagement/SubscribeManagementTab';
import SubscribeHistoryTab from '@/features/payment/Subscribe/SubscribeHistory/SubscribeHistoryTab';
import {IcChevronRight} from '@/assets/icon';

import style from '@/assets/styles/style.module.scss';
import {goToParentUrl} from '@/utils';

function SubscribeManagement() {
	const location = useLocation();
	const navigate = useNavigate();
	const {selectedValue, handleChangeTab} = useTabQueryParam({
		key: 'mode',
		defaultValue: 'management',
	});
	return (
		<ContentWrapper fullWidth={true}>
			<Typography variant="header1">서비스 구독 관리</Typography>
			<Tab
				tabLabel="subscribe"
				selected={selectedValue}
				options={[
					{label: '구독관리', value: 'management'},
					{label: '구독내역', value: 'history'},
				]}
				handleChange={(e, value) => {
					handleChangeTab(value as string);
					const {pathname, search} = location;
					const {idx, mode, ...parsed} = parse(search);
					if (idx) {
						navigate(
							`${pathname}${stringify(
								{...parsed, mode: value},
								{
									addQueryPrefix: true,
								}
							)}`,
							{
								replace: true,
							}
						);
					}
				}}
				sx={{
					marginTop: '16px !important',
				}}>
				<Link
					className="flex-center cursor-pointer"
					sx={{
						fontSize: 14,
						fontWeight: 700,
						textDecoration: 'none',
					}}
					onClick={() => {
						goToParentUrl('/pricing');
					}}>
					자세한 가격 및 기능{' '}
					<IcChevronRight
						color={style.virclePrimary500}
						width={16}
						height={16}
					/>
				</Link>
			</Tab>
			<Stack>
				{selectedValue === 'management' && (
					<Suspense fallback={<Fallback />}>
						<SubscribeManagementTab />
					</Suspense>
				)}
				{selectedValue === 'history' && <SubscribeHistoryTab />}
			</Stack>
		</ContentWrapper>
	);
}

const Fallback = () => (
	<Stack>
		<Stack
			flexDirection={{
				xs: 'column',
				md: 'row',
			}}
			flex={1}
			gap="24px"
			mt="32px">
			<Stack>
				{new Array(2).fill(null).map((_, idx) => (
					<FallbackItem key={idx} />
				))}
			</Stack>
			<Stack
				sx={{
					borderRadius: '8px',
					border: (theme) => `1px solid ${theme.palette.grey[100]}`,
					width: '340px',
					padding: '20px',
					gap: '8px',
				}}>
				<Skeleton variant="rectangular" width={'40%'} />
				<Skeleton variant="rectangular" width={'60%'} />
				<Skeleton variant="rectangular" width={'90%'} />
				<Skeleton variant="rectangular" width={'90%'} />
			</Stack>
		</Stack>
	</Stack>
);

const FallbackItem = () => {
	return (
		<Stack
			sx={{
				minWidth: '460px',
				minHeight: '80px',
				borderRadius: '8px',
				border: (theme) => `1px solid ${theme.palette.grey[100]}`,
				padding: '20px',
				marginBottom: '16px',
			}}>
			<Stack flexDirection="row" mb={0.5}>
				<Skeleton
					variant="rectangular"
					width={'10%'}
					sx={{
						marginRight: '1%',
					}}
				/>
				<Skeleton variant="rectangular" width={'5%'} />
			</Stack>
			<Skeleton variant="rectangular" width={'80%'} />
		</Stack>
	);
};

export default SubscribeManagement;
