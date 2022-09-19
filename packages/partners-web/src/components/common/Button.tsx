import {SerializedStyles} from '@emotion/react';

import {Button as MuiButton} from '@mui/material';

interface Props {
	children: React.ReactNode;
	emStyle?: SerializedStyles;
	onClick: () => void;
}

function Button({children, emStyle, onClick}: Props) {
	return (
		<MuiButton variant="contained" css={emStyle} onClick={onClick}>
			{children}
		</MuiButton>
	);
}

export default Button;
