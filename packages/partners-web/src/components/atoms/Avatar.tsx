import {Avatar as MuiAvatar, AvatarProps} from '@mui/material';

interface Props extends Omit<AvatarProps, 'size'> {
	size?: number;
}

function Avatar({size = 32, sx, children, ...props}: Props) {
	return (
		<MuiAvatar
			sx={{
				borderWidth: '1.88px',
				borderColor: 'grey.600',
				borderRadius: '22.5px',
				backgroundColor: 'grey.500',
				fontSize: '22px',
				fontWeight: 400,
				width: size,
				height: size,
				...sx,
			}}
			{...props}>
			{children ?? null}
		</MuiAvatar>
	);
}

export default Avatar;
