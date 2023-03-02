import {useState, useMemo, useEffect, useCallback} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import {SxProps} from '@mui/system';
import {styled, Theme, CSSObject} from '@mui/material/styles';
import {
	Drawer as MuiDrawer,
	List,
	Typography,
	Divider,
	IconButton,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListItemButton,
	Collapse,
	Stack,
	Box,
	useMediaQuery,
} from '@mui/material';

import {IcChevronDown, IcChevronRight, IcExclamationMark} from '@/assets/icon';
import {ImgUsageGuideRobot, ImgUsageGuideRobot2x} from '@/assets/images';
import style from '@/assets/styles/style.module.scss';
import {
	SIDEBAR_WIDTH,
	FOLDED_SIDEBAR_WIDTH,
	HEADER_HEIGHT,
	checkDepth2MenuSelected,
	getSelectedDepth1Menu,
} from '@/data';

import {Menu, MenuDepth1, MenuDepth2} from '@/@types';
import {useGetMenu, useSidebarControlStore} from '@/stores';
import {sendAmplitudeLog} from '@/utils';

const openedMixin = (theme: Theme): CSSObject => ({
	width: SIDEBAR_WIDTH,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: `calc(${FOLDED_SIDEBAR_WIDTH} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${FOLDED_SIDEBAR_WIDTH} + 1px)`,
	},
});

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
	width: SIDEBAR_WIDTH,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme),
	}),
}));

export default function Sidebar() {
	const menuList = useGetMenu();
	const isSidebarOpen = useSidebarControlStore((state) => state.isOpen);
	const setSidebarOpen = useSidebarControlStore((state) => state.setOpen);
	const matchUpMd = useMediaQuery((theme) => theme.breakpoints.up('md'));

	useEffect(() => {
		setSidebarOpen(matchUpMd ? true : false);
	}, [matchUpMd]);

	return (
		<>
			<Drawer
				variant="permanent"
				open={isSidebarOpen}
				sx={{
					zIndex: 1,
					'& .MuiDrawer-paper': {
						top: HEADER_HEIGHT,
						height: `calc(100% - ${HEADER_HEIGHT})`,

						// scroll
						overflowY: 'hidden',
						'&:hover': {
							overflowY: 'overlay',
						},
						'&::-webkit-scrollbar': {
							width: '4px',
						},
						'&::-webkit-scrollbar-thumb': {
							background: 'rgba(230, 233, 236, 0.6)',
							borderRadius: '4px',
						},
						'&::-webkit-scrollbar-track': {
							background: 'rgba(255, 255, 255, 0)',
						},
					},
					position: 'fixed',
				}}>
				{menuList.map((menu, idx) => (
					<Menu
						key={idx}
						open={isSidebarOpen}
						data={menu}
						isLast={menuList.length - 1 === idx}
					/>
				))}
				{isSidebarOpen && <UsageGuide />}
				<ControlDrawerButton
					open={isSidebarOpen}
					onControlDrawer={() => setSidebarOpen(!isSidebarOpen)}
				/>
			</Drawer>
		</>
	);
}

const selectedListItemButtonSxProps: SxProps<Theme> = {
	'& > .MuiListItemButton-root': {
		'& .MuiListItemText-root .MuiTypography-root': {
			color: 'primary.main',
			fontWeight: 'bold',
		},
		'& .MuiListItemIcon-root svg': {
			color: 'primary.main',
		},
	},
};

const Menu = ({
	open,
	data,
	isLast,
}: {
	open: boolean;
	data: MenuDepth1[];
	isLast: boolean;
}) => {
	const {pathname} = useLocation();
	// 선택된 depth1 메뉴
	const [selectedDepth1Menu, setSelectedDepth1Menu] = useState<Menu | null>(
		null
	);
	// 열려있는 depth1 메뉴
	const [openedChildrenMenu, setOpenedChildrenMenu] = useState<Menu | null>(
		null
	);

	const selectedMenu = useMemo(() => {
		return getSelectedDepth1Menu(pathname);
	}, [pathname]);

	// 초기 세팅
	useEffect(() => {
		setSelectedDepth1Menu(selectedMenu);
	}, [selectedMenu]);

	useEffect(() => {
		// 닫혔을 때 자식 메뉴 닫힘 처리
		if (!open) {
			setOpenedChildrenMenu(null);
			return;
		}
		setOpenedChildrenMenu(selectedMenu);
	}, [open, selectedMenu]);

	const onOpenChildrenMenu = useCallback((value: Menu) => {
		setOpenedChildrenMenu((prev) => (prev === value ? null : value));
	}, []);

	return (
		<Stack
			sx={{
				p: '0',
			}}>
			<List
				sx={{
					p: '8px 0',
					transition: 'padding 100ms ease-in-out',
					'& .MuiListItem-root': {
						display: 'block',
						'& .MuiListItemButton-root': {
							justifyContent: 'center',
							height: open ? '48px' : '40px',
							padding: open ? '0 16px 0 20px' : '8px 24px',
							'& .MuiListItemIcon-root': {
								justifyContent: 'center',
								minWidth: '0',
								mr: open ? '8px' : 'auto',
								'& svg': {
									color: 'grey.900',
									width: 24,
									height: 24,
								},
							},
							'& .MuiListItemText-root': {
								opacity: open ? 1 : 0,
								m: 0,
							},
						},
						// 자식메뉴
						'& .menu-children': {
							'& .MuiListItemButton-root': {
								height: '40px',
								p: 0,
								paddingLeft: '52px',
							},
						},
					},
					// 메뉴 선택됨
					'& > .MuiListItem-root.selected': {
						'&.menu-parent': {
							backgroundColor: 'primary.50',
						},
						...(!open && {
							'&.menu-parent-children': {
								backgroundColor: 'primary.50',
							},
						}),
						...selectedListItemButtonSxProps,
					},
					// 자식 메뉴 선택됨
					'& .menu-children .MuiListItem-root.selected': {
						backgroundColor: 'primary.50',
						...selectedListItemButtonSxProps,
					},
				}}>
				{data.map((groupMenu, idx) => {
					return (
						<GroupMenu
							key={idx}
							isSidebarOpen={open}
							selectedDepth1Menu={selectedDepth1Menu}
							openedChildrenMenu={openedChildrenMenu}
							onOpenChildrenMenu={onOpenChildrenMenu}
							data={groupMenu}
						/>
					);
				})}
			</List>
			{!isLast && (
				<Divider
					sx={{
						width: open ? 'calc(100% - 40px)' : 'calc(100% - 16px)',
						m: 'auto',
						borderColor: style.vircleGrey100,
					}}
				/>
			)}
		</Stack>
	);
};

const GroupMenu = ({
	isSidebarOpen,
	selectedDepth1Menu,
	openedChildrenMenu,
	onOpenChildrenMenu,
	data,
}: {
	isSidebarOpen: boolean;
	selectedDepth1Menu: Menu | null;
	openedChildrenMenu: Menu | null;
	onOpenChildrenMenu: (value: Menu) => void;
	data: MenuDepth1;
}) => {
	const {pathname} = useLocation();
	const navigate = useNavigate();
	const {menu, title, icon, path, emphasis, children, event} = data;

	const isDepth1Selected = useMemo(() => {
		return menu === selectedDepth1Menu;
	}, [menu, selectedDepth1Menu]);

	const isChildrenOpen = useMemo(() => {
		return menu === openedChildrenMenu;
	}, [menu, openedChildrenMenu]);

	const handleControlDepth1Menu = () => {
		if (event) {
			sendAmplitudeLog(event[0], {
				button_title: event[1],
			});
		}
		// 사이드바 닫혀 있을 때(아이콘만 보일 때)
		if (!isSidebarOpen && children && children?.length > 0) {
			const firstChildMenu = children[0].path;
			navigate(firstChildMenu);
			return;
		}
		// 사이드바 열렸을 때
		onOpenChildrenMenu(menu);

		if (path) {
			navigate(path);
			return;
		}
	};

	const handleControlDepth2Menu = (depth2: MenuDepth2) => {
		if (depth2.event) {
			sendAmplitudeLog(depth2.event[0], {
				button_title: depth2.event[1],
			});
		}
		navigate(depth2.path);
	};

	return (
		<ListItem
			key={title}
			disablePadding
			className={[
				isDepth1Selected ? 'selected' : '',
				children ? 'menu-parent-children' : 'menu-parent',
			].join(' ')}
			onClick={handleControlDepth1Menu}>
			<ListItemButton
				sx={{
					...(emphasis && {
						'&::before': {
							content: `'⦁'`,
							color: 'red.main',
							fontSize: '16px',
							position: 'absolute',
							left: '8px',
						},
					}),
				}}>
				<ListItemIcon>{icon}</ListItemIcon>
				<ListItemText
					primary={
						<Stack
							flexDirection="row"
							justifyContent="space-between"
							alignItems="center">
							<Typography
								variant="body3"
								color={style.vircleGrey900}>
								{title}
							</Typography>
							{children && (
								<IcChevronDown
									width={16}
									height={16}
									color={style.vircleGrey300}
									style={{
										transform: isChildrenOpen
											? 'rotate(180deg)'
											: 'rotate(0deg)',
									}}
								/>
							)}
						</Stack>
					}
				/>
			</ListItemButton>
			{/* 자식 메뉴 */}
			<Collapse in={children && isChildrenOpen} unmountOnExit>
				<List disablePadding className="menu-children">
					{children?.map((child) => {
						const {title, path, emphasis} = child;
						const isDepth2Selected = checkDepth2MenuSelected(
							pathname,
							path
						);
						return (
							<ListItem
								disablePadding
								key={title}
								className={isDepth2Selected ? 'selected' : ''}
								onClick={(e) => {
									e.stopPropagation();
									handleControlDepth2Menu(child);
								}}>
								<ListItemButton key={title}>
									<ListItemText
										primary={
											<>
												<Typography
													component="span"
													variant="caption1"
													color="grey.900">
													{title}
												</Typography>
												{emphasis && (
													<IcExclamationMark
														width={13}
														height={13}
														color={
															style.vircleRed500
														}
														style={{
															marginLeft: '4px',
															position:
																'relative',
															top: '2px',
														}}
													/>
												)}
											</>
										}
									/>
								</ListItemButton>
							</ListItem>
						);
					})}
				</List>
			</Collapse>
		</ListItem>
	);
};

const ControlDrawerButton = ({
	open,
	onControlDrawer,
}: {
	open: boolean;
	onControlDrawer: () => void;
}) => {
	return (
		<IconButton
			onClick={onControlDrawer}
			sx={{
				position: 'absolute',
				bottom: '16px',
				right: open ? '16px' : '22px',
				backgroundColor: 'primary.50',
				borderRadius: '7px',
				width: '28px',
				height: '28px',
			}}>
			<IcChevronRight
				color={style.vircleBlue500}
				width={16}
				height={16}
				style={{
					transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
				}}
			/>
		</IconButton>
	);
};

const UsageGuide = () => {
	return (
		<Stack
			sx={{
				position: 'relative',
				margin: '16px',
				marginTop: '40px',
			}}>
			<Typography variant="subtitle1" zIndex={1}>
				버클 이용가이드
			</Typography>
			<Typography variant="caption1" zIndex={1}>
				10분만에 마스터하기!
			</Typography>
			<Stack
				className="cursor-pointer"
				flexDirection="row"
				zIndex={1}
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingX: '10px',
					width: '78px',
					height: '34px',
					marginTop: '16px',
					borderRadius: '34px',
					backgroundColor: 'grey.900',
				}}
				data-tracking={`dashboard_left_banner_click,{'button_title': '이용가이드 배너'}`}
				onClick={() => {
					window.open(VIRCLE_GUIDE_URL);
				}}>
				<Box
					sx={{
						fontSize: '14px',
						fontWeight: 'bold',
						color: 'white',
					}}>
					GO!
				</Box>
				<Box
					className="flex-center"
					width={14}
					height={14}
					sx={{
						borderRadius: '50%',
						border: '1px solid #FFF',
					}}>
					<IcChevronRight width={10} height={10} color="#FFF" />
				</Box>
			</Stack>
			<img
				src={ImgUsageGuideRobot}
				srcSet={`${ImgUsageGuideRobot} 1x, ${ImgUsageGuideRobot2x} 2x`}
				alt="usage guide"
				width={176}
				style={{
					position: 'absolute',
					right: 0,
				}}
			/>
		</Stack>
	);
};
