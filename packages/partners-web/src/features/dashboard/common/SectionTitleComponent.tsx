import React from 'react';

import {Box, Typography, SxProps} from '@mui/material';

interface SectionTitleProps {
	boxTitle: string | JSX.Element;
	boxSubtitle?: string | JSX.Element;
	BoxMarginBottom?: string;
	sx?: SxProps;
}

function SectionTitleComponent({
	boxTitle,
	boxSubtitle,
	BoxMarginBottom,
	sx,
}: SectionTitleProps) {
	return (
		<Box
			sx={{
				marginBottom: BoxMarginBottom ? BoxMarginBottom : '20px',
				...sx,
			}}>
			{typeof boxTitle === 'string' ? (
				<Typography
					variant="h3"
					sx={{
						fontWeight: 700,
						fontSize: '21px',
						lineHeight: '145%',
						color: 'grey.900',
					}}>
					{boxTitle}
				</Typography>
			) : (
				<>{boxTitle}</>
			)}

			{boxSubtitle &&
				(typeof boxTitle === 'string' ? (
					<Typography
						variant="h4"
						sx={{
							fontWeight: 500,
							fontSize: '15px',
							lineHeight: '145%',
							color: 'grey.600',
							marginTop: '4px',
						}}>
						{boxSubtitle}
					</Typography>
				) : (
					<Box
						mt={'4px'}
						sx={{
							fontSize: '15px',
							lineHeight: '145%',
							color: 'grey.600',
							fontWeight: 500,
						}}>
						{boxSubtitle}
					</Box>
				))}
		</Box>
	);
}

export default SectionTitleComponent;
