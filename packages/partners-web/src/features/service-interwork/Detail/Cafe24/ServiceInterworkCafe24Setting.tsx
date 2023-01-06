import {List, ListItem, Stack, Typography} from '@mui/material';

import ServiceInterworkCafe24Title from '@/features/service-interwork/Detail/Cafe24/ServiceInterworkCafe24Title';
import ServiceInterworkCafe24SettingForm from '@/features/service-interwork/Detail/Cafe24/ServiceInterworkCafe24SettingForm';
import ServiceInterworkCafe24IntroduceContent from '@/features/service-interwork/Detail/Cafe24/ServiceInterworkCafe24IntroduceContent';
import {Cafe24Interwork} from '@/@types';

interface Props {
	data?: Cafe24Interwork;
}

function ServiceInterworkCafe24Setting({data}: Props) {
	return (
		<Stack
			flexDirection="column"
			width="100%"
			maxWidth="800px"
			margin="auto"
			my={5}>
			<ServiceInterworkCafe24Title data={data} />
			<ServiceInterworkCafe24SettingForm data={data} />
			<Cafe24InterworkSettingGuide />
			<ServiceInterworkCafe24IntroduceContent />
		</Stack>
	);
}

const Cafe24InterworkSettingGuide = () => {
	return (
		<Stack
			p="24px"
			mb="60px"
			sx={{
				backgroundColor: 'grey.50',
				borderRadius: '8px',
			}}>
			<Typography variant="body3" fontWeight="700" borderBottom="2px">
				안내
			</Typography>
			<List
				sx={(theme) => ({
					padding: 0,
					'& .MuiListItem-root': {
						display: 'list-item',
						listStyleType: 'disc',
						marginLeft: '14px',
						padding: '0 0 0 2px',
						color: theme.palette.grey[400],
						fontSize: 14,
						lineHeight: 1.45,
					},
				})}>
				<ListItem>
					개런티 발행에 필요한 필수항목이 부족할경우, 개런티는
					“신청대기" 상태로 분류됩니다.
				</ListItem>
				<ListItem>
					수동으로 정보를 입력하고 개런티를 발급할 수 있습니다.
				</ListItem>
				<ListItem>
					교환: 기존 발행된 개런티는 폐기되고, 교환상품에 대해 새
					개런티가 발행됩니다.
				</ListItem>
				<ListItem>반품: 기존 발행된 개런티는 폐기됩니다.</ListItem>
			</List>
		</Stack>
	);
};

export default ServiceInterworkCafe24Setting;
