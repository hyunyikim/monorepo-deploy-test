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
				color="grey.300"
				fontSize={14}
				lineHeight="14px"
				fontWeight="bold"
				mb="10px">
				{title}
			</Typography>
			<Typography
				fontSize={fontSize}
				lineHeight={`${fontSize}px`}
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
