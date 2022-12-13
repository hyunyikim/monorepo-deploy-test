import {useMemo} from 'react';

import {Box, Typography} from '@mui/material';

import {formatPhoneNum, goToParentUrl} from '@/utils';

import {Avatar} from '@/components';

interface Props {
	profileImgSize: 60 | 54;
	data: {
		name?: string;
		phoneNumber?: string;
	};
	isNameLink?: boolean;
}

function CustomerInfoLabel({
	profileImgSize = 60,
	data,
	isNameLink = false,
}: Props) {
	const purePhoneNumber = useMemo(() => {
		const phoneNumber = data?.phoneNumber;
		if (!phoneNumber) {
			return '';
		}
		return phoneNumber.replace(/\-/g, '');
	}, [data?.phoneNumber]);

	return (
		<Box
			display="flex"
			flexDirection="row"
			alignItems="center"
			gap="12px"
			width="fit-content">
			<Avatar size={profileImgSize}>
				{data?.name && data?.name.slice(0, 1)}
			</Avatar>
			<Box>
				<Typography
					fontWeight="700"
					fontSize={profileImgSize === 60 ? 21 : 16}
					{...(isNameLink && {
						className: 'underline',
						onClick: () => {
							goToParentUrl(
								`/b2b/customer/${
									data?.name || ''
								}/${purePhoneNumber}`
							);
						},
					})}>
					{data?.name}
				</Typography>
				<Typography width="max-content">
					{data?.phoneNumber
						? formatPhoneNum(data?.phoneNumber)
						: '-'}
				</Typography>
			</Box>
		</Box>
	);
}

export default CustomerInfoLabel;
