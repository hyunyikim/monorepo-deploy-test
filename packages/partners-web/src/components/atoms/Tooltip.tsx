import React, {ReactElement} from 'react';
import {Box, Typography, Tooltip, TooltipProps} from '@mui/material';
import styled from '@emotion/styled';

import whiteClose from '@/assets/icon/ic_close_white_16.png';
import {IcClose} from '@/assets/icon';

const CloseButtonStyle = styled('button')`
	width: 16px;
	height: 16px;
	background: url(${whiteClose}) no-repeat;
	border: none;
`;

type DirectionType =
	| 'bottom'
	| 'left'
	| 'right'
	| 'top'
	| 'top-start'
	| 'bottom-end'
	| 'bottom-start'
	| 'left-end'
	| 'left-start'
	| 'right-end'
	| 'right-start'
	| 'top-end';

interface Props extends TooltipProps {
	// direction?: DirectionType;
	minWidth?: string;
	maxWidth?: string;
	isOpen?: boolean;
	onClickCloseBtn: (
		event: React.MouseEventHandler<HTMLButtonElement> | undefined
	) => void;
}

function TooltipComponent({
	children,
	title = '',
	isOpen = true,
	// direction = 'bottom-start',
	minWidth = '245px',
	maxWidth = 'auto',
	onClickCloseBtn,
	arrow,
	...props
}: Props) {
	return (
		<Tooltip
			sx={{
				marginTop: '8px',
			}}
			title={
				<Box
					sx={{
						display: 'flex',
						gap: '15px',
						justifyContent: 'space-between',
						borderRadius: '6px',
						padding: '12px',
						backdropFilter: 'blur(7.5px)',
						zIndex: 100,
						minWidth: minWidth,
						maxWidth: maxWidth,
						'&::before': {
							content: "''",
							width: '0px',
							height: '0px',
							backdropFilter: 'blur(7.5px)',
							borderBottom: '5px solid rgba(0, 0, 0, 0.6)',
							borderTop: '0px solid transparent',
							borderLeft: '6px solid transparent',
							borderRight: '6px solid transparent',
							position: 'absolute',
							left: '12px',
							top: '-4px',
							backgroundColor: 'white',
						},
					}}>
					{title}

					<CloseButtonStyle onClick={onClickCloseBtn} />
				</Box>
			}
			open={isOpen}
			describeChild={true}
			arrow={false}
			placement={'bottom-start'}
			{...props}>
			{children && <Box>{children}</Box>}
		</Tooltip>
	);
}

export default TooltipComponent;
