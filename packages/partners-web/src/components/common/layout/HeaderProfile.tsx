import {useCallback, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {ButtonBase, Typography, MenuItem, Menu, Stack} from '@mui/material';

import {Avatar} from '@/components';
import {PartnershipInfoResponse} from '@/@types';
import {useLoginStore} from '@/stores';

interface Props {
	data: PartnershipInfoResponse;
}

function HeaderProfile({data}: Props) {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const setLogout = useLoginStore((state) => state.setLogout);

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			setAnchorEl(event.currentTarget);
		},
		[]
	);

	const handleClose = useCallback(() => {
		setAnchorEl(null);
	}, []);

	const handleLogout = useCallback(() => {
		setLogout();
		navigate('/auth/login', {
			replace: true,
		});
	}, [setLogout]);

	const isOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);

	const profileImage = useMemo(() => {
		if (data?.profileImage) {
			return data?.profileImage;
		}
		return '';
	}, [data]);

	return (
		<Stack direction="row" alignItems="center" position="relative">
			<Typography
				display={'inline-block'}
				fontSize={14}
				position="relative"
				noWrap={true}
				minWidth="40px">
				{data?.companyName}
			</Typography>
			<ButtonBase disableRipple onClick={handleClick}>
				<Avatar
					src={profileImage}
					sx={{
						position: 'relative',
						borderStyle: 'solid',
						borderWidth: '1px',
						borderColor: 'grey.50',
						boxSizing: 'content-box',
						marginLeft: '12px',
						'&:hover': {
							borderWidth: '5px',
							borderColor: 'primary.50',
							transform: 'translateX(4px)',
							marginLeft: '4px',
						},
					}}
				/>
			</ButtonBase>
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				keepMounted
				open={isOpen}
				onClose={handleClose}
				sx={{
					'.MuiMenu-paper': {
						minWidth: '160px',
						borderRadius: '8px',
						boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
						transform: 'translateY(10px) !important',
						'& .MuiMenuItem-root': {
							fontSize: '14px',
							height: '40px',
						},
					},
				}}>
				<MenuItem
					onClick={() => {
						navigate('/setting/profile');
						handleClose();
					}}>
					계정 설정
				</MenuItem>
				<MenuItem onClick={handleLogout}>로그아웃</MenuItem>
			</Menu>
		</Stack>
	);
}

export default HeaderProfile;
