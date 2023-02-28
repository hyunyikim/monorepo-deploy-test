import {PAGE_MAX_WIDTH} from '@/data';
import {Stack} from '@mui/material';

interface Props {
	fullWidth?: boolean;
	maxWidth?: number | string;
	children: React.ReactNode;
}

function ContentWrapper({fullWidth, maxWidth, children}: Props) {
	return (
		<Stack
			flexDirection="column"
			sx={{
				margin: {
					xs: '16px',
					sm: '40px',
				},
				// ...(fullWidth && {}),
				...(!fullWidth && {
					// margin: '40px',
					maxWidth: maxWidth
						? typeof maxWidth === 'number'
							? `${maxWidth}px`
							: maxWidth
						: PAGE_MAX_WIDTH,
				}),
			}}>
			{children}
		</Stack>
	);
}

export default ContentWrapper;
