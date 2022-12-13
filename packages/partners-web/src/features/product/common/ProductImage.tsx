import {Box, SxProps} from '@mui/material';

import {IcEmptyImage} from '@/assets/icon';

interface Props {
	onImgClick?: () => void;
	src?: string | null;
	sx?: SxProps;
}

function ProductImage({onImgClick, src, sx = {}}: Props) {
	return src ? (
		<Box
			sx={{
				width: '60px',
				height: '60px',
				backgroundColor: 'grey.10',
				border: (theme) => `1px solid ${theme.palette.grey[100]}`,
				...{sx},
			}}>
			<img
				src={src}
				style={{
					width: '100%',
					height: '100%',
				}}
				{...(onImgClick && {
					onClick: onImgClick,
					className: 'cursor-pointer',
				})}
			/>
		</Box>
	) : (
		<Box
			className="flex-center"
			sx={{
				width: '60px',
				height: '60px',
				backgroundColor: 'grey.10',
				border: (theme) => `1px solid ${theme.palette.grey[100]}`,
			}}>
			<IcEmptyImage />
		</Box>
	);
}

export default ProductImage;
