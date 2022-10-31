import {useCallback, useRef, useState} from 'react';

import {
	Grow,
	Avatar,
	Card,
	CardContent,
	Chip,
	ClickAwayListener,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Popper,
	Typography,
	useTheme,
	Stack,
	Divider,
} from '@mui/material';
import {IconLogout, IconSettings} from '@tabler/icons';

function HeaderProfile() {
	const [open, setOpen] = useState(false);
	const anchorRef = useRef<HTMLDivElement | null>(null);
	const theme = useTheme();

	// TODO: 임시 데이터 -> partnershipData 불러오기
	const partnershipData = {
		name: '매스어답션',
	};

	const handlePageChange = (menu, path) => {
		// return history.push(path);
	};

	const handleLogOut = () => {
		// dispatch(setLogOut());
		// window.location.reload();
	};

	const handleMenu = useCallback((value: boolean) => {
		setOpen(value);
	}, []);

	const handleToggle = () => {
		setOpen(!open);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Chip
				sx={{
					display: 'flex',
					alignItems: 'center',
					width: '84px',
					height: '40px',
					borderRadius: '40px',
					borderColor: theme.palette.grey[50],
					backgroundColor: theme.palette.grey[50],
					transition: 'all .2s ease-in-out',
					'&:hover': {
						borderColor: theme.palette.primary.light,
						background: `${theme.palette.primary.light} !important`,
					},
					'.MuiChip-label': {
						lineHeight: 0,
						padding: '8px 10px',
					},
				}}
				icon={
					<Avatar
						sx={{
							width: '34px',
							height: '34px',
							margin: '3px 0 3px 3px !important',
							border: 'none',
						}}
						ref={anchorRef}
						// TODO: 파트너 이미지
						// src={partnershipData?.profileImage}
						src={null ?? ''}
					/>
				}
				label={
					<IconSettings
						stroke={1.5}
						size="1.5rem"
						color={theme.palette.primary.main}
					/>
				}
				variant="outlined"
				ref={anchorRef}
				onClick={() => handleMenu(true)}
				color="primary"
			/>
			<Popper
				placement="bottom-end"
				open={open}
				anchorEl={anchorRef.current}
				role={undefined}
				transition
				disablePortal
				popperOptions={{
					modifiers: [
						{
							name: 'offset',
							options: {
								offset: [0, 14],
							},
						},
					],
				}}>
				{({TransitionProps}) => (
					<ClickAwayListener onClickAway={() => handleMenu(false)}>
						<Grow {...TransitionProps}>
							<Card
								sx={{
									borderRadius: '8px',
									boxShadow:
										'0px 0px 20px rgba(0, 0, 0, 0.25)',
								}}>
								<CardContent
									sx={{
										padding: '24px',
									}}>
									<Stack direction="column">
										<Typography
											variant="h4"
											sx={{
												fontWeight: '700',
											}}>
											{`${partnershipData?.name}님,`}
										</Typography>
										<Typography
											sx={{
												marginBottom: '8px',
												fontSize: '16px',
											}}>
											안녕하세요
										</Typography>
										<Chip
											label="기업회원"
											color="primary"
											variant="outlined"
											sx={{
												width: 'fit-content',
												height: '24px',
												lineHeight: '22px',
												borderRadius: '4px',
												'& > span': {
													lineHeight: 1,
													fontSize: '14px',
													padding: '0 8px',
												},
											}}
										/>
									</Stack>
									<Divider
										sx={{
											marginTop: '16px',
										}}
									/>
									<List
										component="nav"
										sx={{
											maxWidth: '300px',
											minWidth: '200px',
											borderRadius: '10px',
										}}>
										{[
											{
												onClick: () => {
													console.log(
														'click Icon Setting'
													);
													// /setting/profile
												},
												title: '프로필 설정',
												icon: (
													<IconSettings
														stroke={1.5}
														size="1.3rem"
													/>
												),
											},
											{
												onClick: () => {
													console.log(
														'click handleLogOut'
													);
													// handleLogOut
												},
												title: '로그아웃',
												icon: (
													<IconLogout
														stroke={1.5}
														size="1.3rem"
													/>
												),
											},
										].map((item) => (
											<ListItemButton
												key={item.title}
												sx={{
													paddingLeft: '4px',
												}}>
												<ListItemIcon
													sx={{
														color: theme.palette
															.common.black,
													}}>
													{item.icon}
												</ListItemIcon>
												<ListItemText
													primary={item.title}
												/>
											</ListItemButton>
										))}
									</List>
								</CardContent>
							</Card>
						</Grow>
					</ClickAwayListener>
				)}
			</Popper>
		</>
	);
}

export default HeaderProfile;
