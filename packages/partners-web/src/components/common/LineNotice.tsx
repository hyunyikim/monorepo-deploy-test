import {Stack, Theme, Typography} from '@mui/material';

import {ColorType} from '@/@types';
import {IcLoudSpeaker} from '@/assets/icon';
import {SxProps} from '@mui/system';

type LineNoticeColor = Extract<ColorType, 'primary' | 'red' | 'green'>;
interface Props {
	color: LineNoticeColor;
	content: string | (string | React.ReactNode)[];
	sx?: SxProps<Theme>;
}

function LineNotice({color, content, sx}: Props) {
	return (
		<Stack
			flexDirection="row"
			alignItems="center"
			sx={[
				(theme) => ({
					width: '100%',
					padding: '14px 16px',
					backgroundColor: `${color}.50`,
					borderRadius: '8px',
					'& p, & span': {
						color: `${color}.main`,
					},
					svg: {
						color: theme.palette[color]['main'],
					},
				}),
				...(Array.isArray(sx) ? sx : [sx]),
			]}>
			<Stack alignItems="flex-start">
				<IcLoudSpeaker />
			</Stack>
			<Stack ml={1}>
				{Array.isArray(content) ? (
					<>
						<Typography variant="caption1">{content[0]}</Typography>
						{content[1]}
					</>
				) : (
					<Typography variant="caption1">{content}</Typography>
				)}
			</Stack>
		</Stack>
	);
}

export default LineNotice;
