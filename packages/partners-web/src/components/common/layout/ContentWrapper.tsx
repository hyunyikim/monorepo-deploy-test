import {PAGE_MAX_WIDTH} from '@/data';
import {Stack} from '@mui/material';

interface Props {
	fullWidth?: boolean;
	maxWidth?: number;
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
					maxWidth: maxWidth ? `${maxWidth}px` : PAGE_MAX_WIDTH,
				}),
			}}>
			{children}
		</Stack>
	);
}

export default ContentWrapper;
