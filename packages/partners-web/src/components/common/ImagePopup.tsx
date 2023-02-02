import {Box} from '@mui/material';

import {sendAmplitudeLog, sendAmplitudeLog} from '@/utils';

import {IcEmptyImage} from '@/assets/icon';

interface Props {
	image?: string;
	alt: string;
	style?: any;
	onClick: (value: {imgSrc: string; imgAlt: string}) => void;
}

const imagePopupSx = {
	margin: '6px auto',
	width: '52px',
	height: '52px',
	minWidth: '52px',
	minHeight: '52px',
	borderWidth: '0.5px',
	borderStyle: 'solid',
	borderColor: 'grey.100',
};

function ImagePopup({image, alt, style = {}, onClick}: Props) {
	const onImageClick = (imgSrc: string, imgAlt: string) => {
		sendAmplitudeLog('guarantee_list_itemimage_click', {
			button_title: `상품이미지 클릭`,
		});

		onClick({
			imgSrc,
			imgAlt,
		});
	};
	return image ? (
		<Box
			sx={{
				cursor: 'pointer',
				background: '#fff',
				backgroundSize: 'cover',
				backgroundImage: image ? `url(${image || ''})` : '',
				...imagePopupSx,
			}}
			style={style}
			onClick={() => onImageClick(image, alt)}
		/>
	) : (
		<Box
			sx={{
				...imagePopupSx,
				backgroundColor: 'grey.10',
			}}>
			<IcEmptyImage style={{margin: 'auto'}} />
		</Box>
	);
}

export default ImagePopup;
