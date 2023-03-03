import {PAGE_MAX_WIDTH} from '@/data';
import {Stack, Theme} from '@mui/material';
import {SxProps} from '@mui/system';

interface Props {
	fullWidth?: boolean;
	maxWidth?: number | string;
	sx?: SxProps<Theme>;
	children: React.ReactNode;
}

function ContentWrapper({fullWidth, sx, maxWidth, children}: Props) {
	return (
		<Stack
			flexDirection="column"
			sx={[
				{
					margin: {
						xs: '16px',
						sm: '40px',
					},
					...(!fullWidth && {
						width: '100%',
						maxWidth: maxWidth
							? typeof maxWidth === 'number'
								? `${maxWidth}px`
								: maxWidth
							: PAGE_MAX_WIDTH,
						marginX: {
							md: 'auto !important',
						},
					}),
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}>
			{children}
		</Stack>
	);
}

export default ContentWrapper;
