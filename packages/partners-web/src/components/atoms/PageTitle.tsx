import React from 'react';
import {Typography} from '@mui/material';

function PageTitle({
	children,
}: {
	children: string | string[] | JSX.Element | JSX.Element[];
}) {
	return (
		<Typography
			fontSize={28}
			color={'black'}
			lineHeight="32px"
			fontWeight={700}>
			{children}
		</Typography>
	);
}

export default PageTitle;
