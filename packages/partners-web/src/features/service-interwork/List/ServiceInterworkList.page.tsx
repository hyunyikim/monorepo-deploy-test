import {useMemo} from 'react';
import {useAsync} from 'react-use';
import {usePageView, goToParentUrl} from '@/utils';

import {Box, Stack, Typography} from '@mui/material';

import {getInterworkByToken} from '@/api/cafe24.api';
import {useGetPartnershipInfo} from '@/stores';

import Cafe24StartRobotModal from '@/features/service-interwork/List/Cafe24StartRobotModal';
import ServiceInterworkCard from '@/features/service-interwork/List/ServiceInterworkCard';

import {
	ImgServiceInterworkRepair,
	ImgServiceInterworkRepair2x,
} from '@/assets/images';
import Cafe24Logo from '@/assets/images/cafe24/cafe24_logo2.png';
import Cafe24Logo2x from '@/assets/images/cafe24/cafe24_logo2@2x.png';

interface InterworkItem {
	name: 'cafe24' | 'repair';
	title: string;
	subTitle: string | React.ReactElement;
	InfoComponent: React.ReactElement;
	isLinked: boolean;
	onClick: (() => void) | null;
}

const interworkList: InterworkItem[] = [
	{
		name: 'cafe24',
		title: '카페24 주문연동',
		subTitle:
			'카페24 쇼핑몰 주문내역을 연동해서 개런티를 자동 발급할 수 있습니다. 간편하게 개런티를 발급해보세요.',
		InfoComponent: (
			<Box
				className="flex-center"
				sx={{
					backgroundColor: '#D9EFFF',
				}}>
				<img
					src={Cafe24Logo}
					srcSet={`${Cafe24Logo2x} 2x`}
					width="186"
					alt="cafe24-logo"
				/>
			</Box>
		),
		isLinked: false,
		onClick: null,
	},
	{
		name: 'repair',
		title: '수선신청 관리',
		subTitle: (
			<>
				고객이 개런티 상세에서 바로 수선신청이 가능합니다.
				<br /> 수선신청 내역을 한곳에서 관리하세요.
			</>
		),
		InfoComponent: (
			<Box
				className="flex-center"
				sx={{
					backgroundColor: '#EDF9F7',
				}}>
				<img
					src={ImgServiceInterworkRepair}
					srcSet={`${ImgServiceInterworkRepair2x} 2x`}
					alt="repair-logo"
				/>
			</Box>
		),
		isLinked: false,
		onClick: null,
	},
];

function ServiceInterworkList() {
	usePageView('serviceadmin_pv', '서비스연동 관리 진입');

	const {data: partnershipData} = useGetPartnershipInfo();
	const cafe24State = useAsync(async () => {
		return await getInterworkByToken();
	}, []);

	const isLoading = useMemo(() => {
		return cafe24State.loading;
	}, [cafe24State]);

	const isCafe24Linked = useMemo(
		() => (cafe24State?.value ? true : false),
		[cafe24State]
	);
	const isPartnershipLinked = useMemo(
		() => (partnershipData?.useRepair === 'Y' ? true : false),
		[partnershipData]
	);

	const filteredInterworkList = useMemo(() => {
		return interworkList.map((item) => {
			if (item?.name === 'cafe24') {
				return {
					...item,
					onClick: () => goToParentUrl('/b2b/interwork/cafe24'),
					isLinked: isCafe24Linked,
				};
			}
			if (item?.name === 'repair') {
				return {
					...item,
					onClick: () => goToParentUrl('/b2b/interwork/repair'),
					isLinked: isPartnershipLinked,
				};
			}
			return item;
		});
	}, [isCafe24Linked, isPartnershipLinked]);

	return (
		<>
			<Stack
				flexDirection="column"
				width="100%"
				maxWidth="800px"
				margin="auto"
				my={5}>
				<Typography variant="header1" mb="8px">
					서비스 연동 관리
				</Typography>
				<Typography variant="body1" mb="24px">
					내 비즈니스에 맞는 서비스를 활용해보세요!
				</Typography>
				<Stack
					flexDirection={{
						xs: 'column',
						md: 'row',
					}}
					gap="20px">
					{isLoading
						? new Array(2)
								.fill(null)
								.map((_, idx) => (
									<ServiceInterworkCard
										key={idx}
										isLoading={true}
									/>
								))
						: filteredInterworkList.map((item) => (
								<ServiceInterworkCard
									key={item.name}
									name={item.name}
									title={item.title}
									subTitle={item.subTitle}
									InfoComponent={item.InfoComponent}
									isLinked={item.isLinked}
									onClick={item.onClick as () => void}
								/>
						  ))}
				</Stack>
			</Stack>
			<Cafe24StartRobotModal cafe24State={cafe24State} />
		</>
	);
}

export default ServiceInterworkList;
