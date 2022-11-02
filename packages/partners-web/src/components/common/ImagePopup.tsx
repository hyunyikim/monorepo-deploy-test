import {Box} from '@mui/material';

interface Props {
	image?: string;
	alt: string;
	style?: any;
	onClick: (value: {imgSrc: string; imgAlt: string}) => void;
}

function ImagePopup({image, alt, style = {}, onClick}: Props) {
	const onImageClick = (imgSrc: string, imgAlt: string) => {
		// TODO: tracking
		// tracking('guarantee_list_itemimage_click', {button_title: `상품이미지 클릭`});

		onClick({
			imgSrc,
			imgAlt,
		});
	};
	return (
		<Box
			sx={{
				cursor: 'pointer',
				margin: '6px auto',
				width: '52px',
				height: '52px',
				background: '#fff',
				backgroundSize: 'cover',
				borderWidth: '0.5px',
				borderStyle: 'solid',
				borderColor: 'grey.100',
				backgroundImage: image ? `url(${image || ''})` : '',
			}}
			style={style}
			onClick={() => {
				image && onImageClick(image, alt);
			}}
		/>
	);
}

export default ImagePopup;
