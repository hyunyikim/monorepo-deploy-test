import {Stack, Typography} from '@mui/material';

import {useOpen} from '@/utils/hooks';
import {RepairDetail} from '@/@types';

import {ImageModal, ImagePopup} from '@/components';

function RepairDetailInfo({data}: {data: RepairDetail}) {
	const {open, onOpen, onClose, modalData, onSetModalData} = useOpen({});
	return (
		<>
			<Stack
				flexDirection="column"
				padding="32px"
				borderRadius="8px"
				border={(theme) => `1px solid ${theme.palette.grey[100]}`}
				mb="24px">
				<Typography variant="subtitle2">신청 정보</Typography>
				<Stack mt="12px" flexDirection="column">
					<Typography variant="body3" mb="26px">
						{data?.requestMessage}
					</Typography>
					<Stack
						flexDirection="row"
						flexWrap="wrap"
						gap="8px"
						sx={{
							'& > *': {
								margin: '0 !important',
							},
						}}>
						{data.images.map((image) => (
							<ImagePopup
								key={image}
								image={image}
								alt="repair-image"
								onClick={() => {
									onSetModalData({
										imgSrc: image,
										imgAlt: 'repair-image',
									});
									onOpen();
								}}
							/>
						))}
					</Stack>
				</Stack>
			</Stack>
			<ImageModal
				open={open}
				onClose={onClose}
				imgSrc={modalData?.imgSrc}
				imgAlt={modalData?.imgAlt}
			/>
		</>
	);
}

export default RepairDetailInfo;
