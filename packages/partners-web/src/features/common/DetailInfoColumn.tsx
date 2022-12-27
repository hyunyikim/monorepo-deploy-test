import {Stack, Typography, StackProps} from '@mui/material';

interface Props extends StackProps {
	fontSize?: number;
	title: string;
	value: string | number;
	isLink?: boolean;
	onClick?: () => void;
}

function GuaranteeDetailInfoColumn({
	fontSize = 14,
	title,
	value,
	isLink = false,
	onClick,
	...props
}: Props) {
	return (
		<Stack {...props}>
			<Typography
				variant="body3"
				color="grey.300"
				fontWeight="bold"
				mb="10px">
				{title}
			</Typography>
			<Typography
				fontSize={fontSize}
				lineHeight={1.45}
				{...(isLink && {
					className: 'cursor-pointer',
					color: 'primary.main',
					sx: {
						textDecoration: 'underline',
					},
					onClick,
				})}>
				{value}
			</Typography>
		</Stack>
	);
}

export default GuaranteeDetailInfoColumn;
