import React, {ReactNode, useState, useEffect} from 'react';
import {makeStyles} from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import {Box, Typography, Tooltip, Stack, SxProps} from '@mui/material';
import {IcHelp, IcClose} from '@/assets/icon';

interface ToolTipProps {
	content: string | JSX.Element;
	customisedButton?: JSX.Element;
	alwaysPop?: boolean;
	sx?: SxProps;
	openState?: boolean;
	toolTipHandler?: () => void;
}
function ToolTipComponent({
	content,
	customisedButton,
	alwaysPop,
	sx,
	openState,
	toolTipHandler,
}: ToolTipProps) {
	const useStyles = makeStyles((theme) =>
		createStyles({
			tooltip: {
				maxWidth: '240px',
				display: 'flex',
				gap: '8px',
				justifyContent: 'space-between',
				borderRadius: '6px',
				backdropFilter: 'blur(7.5px)',
				padding: '12px',
				left: '-12px',

				'& .MuiTooltip-arrow': {
					left: '12px !important',
				},
				...sx,
			},
			tooltipPlacementTop: {
				margin: '4px 0',
			},
			tooltipPlacementBottom: {
				margin: '4px 0',
			},
		})
	);

	const classes = useStyles();
	const [isOpen, setIsOpen] = useState(false);
	const toolTipOpenHandler = () => {
		setIsOpen((pre) => !pre);
	};

	useEffect(() => {
		if (alwaysPop) {
			setIsOpen(true);
		}
	}, []);

	return (
		<Tooltip
			classes={classes}
			open={openState ? openState : isOpen}
			arrow={true}
			title={
				<Stack
					flexDirection={'row'}
					sx={{
						display: 'flex',
						gap: '8px',
						svg: {
							minWidth: '16px',
							minHeight: '16px',
							cursor: 'pointer',
						},
					}}>
					{typeof content === 'string' ? (
						<Typography
							variant="caption2"
							sx={{
								fontWeight: 500,
								fontSize: '12px',
								lineHeight: '145%',
								color: '#FFFFFF',
							}}>
							{content}
						</Typography>
					) : (
						<Box>{content}</Box>
					)}

					<IcClose
						width={'16px'}
						height={'16px'}
						onClick={
							toolTipHandler ? toolTipHandler : toolTipOpenHandler
						}
					/>
				</Stack>
			}
			describeChild={true}
			placement={'bottom-start'}>
			{customisedButton ? (
				<Box sx={{postion: 'relative'}}>{customisedButton}</Box>
			) : (
				<IcHelp
					onClick={
						toolTipHandler ? toolTipHandler : toolTipOpenHandler
					}
				/>
			)}
		</Tooltip>
	);
}

export default ToolTipComponent;
