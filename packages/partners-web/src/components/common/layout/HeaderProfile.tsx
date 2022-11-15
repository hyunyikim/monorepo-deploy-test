import {useCallback, useMemo, useState} from 'react';
import {ButtonBase, Typography, MenuItem, Menu, Stack} from '@mui/material';

import {Avatar} from '@/components';
import {ImgLogoVirclePartners} from '@/assets/images';

function HeaderProfile() {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const isOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			setAnchorEl(event.currentTarget);
		},
		[]
	);

	const handleClose = useCallback(() => {
		setAnchorEl(null);
	}, []);

	return (
		// TODO:
		<Stack
			className="helloo"
			direction="row"
			alignItems="center"
			sx={{
				position: 'relative',
				backgroundColor: 'yellow',
			}}>
			<Typography
				fontSize={14}
				sx={{
					position: 'relative',
					// right: ''
				}}>
				회사명
			</Typography>
			<ButtonBase disableRipple onClick={handleClick}>
				<Avatar
					// TODO: default icon
					src={ImgLogoVirclePartners}
					sx={{
						position: 'absolute',
						borderWidth: isOpen ? '3px' : '1px',
						borderStyle: 'solid',
						borderColor: 'grey.100',
						boxSizing: 'content-box',
					}}
				/>
			</ButtonBase>
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 32 + 10,
					horizontal: 'left',
				}}
				transformOrigin={{vertical: 'top', horizontal: 'right'}}
				keepMounted
				open={isOpen}
				onClose={handleClose}
				sx={{
					'.MuiMenu-paper': {
						minWidth: '160px',
						borderRadius: '8px',
						boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
					},
				}}>
				{/* TODO: 메뉴 관리 필요 */}
				<MenuItem>Profile</MenuItem>
				<MenuItem>My account</MenuItem>
			</Menu>
		</Stack>
	);
}

export default HeaderProfile;
