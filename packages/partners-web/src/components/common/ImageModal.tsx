import {Typography} from '@mui/material';

import {Dialog} from '@/components';

interface Props {
	open: boolean;
	onClose: () => void;
	imgSrc?: string;
	imgAlt?: string;
}

function ImageModal({open, onClose, imgSrc, imgAlt}: Props) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			showCloseButton={true}
			TitleComponent={
				<Typography fontSize={20} fontWeight={700}>
					이미지
				</Typography>
			}>
			<img src={imgSrc} alt={imgAlt} style={{maxHeight: '70vh'}} />
		</Dialog>
	);
}

export default ImageModal;
