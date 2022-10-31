import {Fragment, useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
	Drawer,
	Divider,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	Collapse,
	useTheme,
	useMediaQuery,
} from '@mui/material';

import {useViewMenuStore, useOpenMenuStore} from '@/stores';
import {MenuName} from '@/@types';
import {sidebarWidth} from '@/data';

import {IcChevronUp, IcChevronDown} from '@/assets/icon';

function Sidebar() {
	const navigate = useNavigate();
	const theme = useTheme();
	const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

	const {open, setOpen} = useOpenMenuStore();
	const menuList = useViewMenuStore((state) => state.menuList());
	const currentMenu = useViewMenuStore((state) => state.currentMenu());
	const [spreadMenu, setSpreadMenu] = useState<MenuName[]>([
		currentMenu.menu,
	]);

	const handleOpenMenu = useCallback((menu: MenuName) => {
		setSpreadMenu((prev) =>
			prev.includes(menu)
				? prev.filter((item) => item !== menu)
				: [...prev, menu]
		);
	}, []);

	// TODO: icon color set
	return (
		<Drawer
			style={{
				background: 'transparent',
			}}
			variant={matchUpMd ? 'persistent' : 'temporary'}
			anchor="left"
			open={false}
			onClose={() => setOpen(false)}
			sx={(theme) => ({
				...(open && {
					width: sidebarWidth,
				}),
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: 'inherit',
					boxSizing: 'border-box',
					background: theme.palette.background.default,
					[theme.breakpoints.up('md')]: {
						top: '60px',
					},
					// scroll styling
					overflowY: 'overlay',
					'&::-webkit-scrollbar, &::-webkit-scrollbar-thumb': {
						backgroundColor: 'transparent',
					},
					'&:hover': {
						overflowY: 'overlay',
						'&::-webkit-scrollbar': {
							width: '5px',
						},
						'&::-webkit-scrollbar-thumb': {
							backgroundColor: '#9e9e9e66',
							borderRadius: '6px',
						},
					},
				},
				fontWeight: 500,
				fontSize: '14px',
				color: theme.palette.grey['900'],
				'& .MuiListItemText-root > span': {
					fontWeight: 500,
				},
				'& .MuiListItemButton-root': {
					padding: '14px 20px',
					borderRadius: '8px',
					'&.Mui-selected .MuiTypography-root': {
						fontWeight: 700,
					},
				},
				// 2 depth
				'& .MuiCollapse-root .MuiListItemButton-root': {
					paddingLeft: '52px',
					'&.Mui-selected': {
						fontWeight: 500,
						background: theme.palette.background.paper,
						'& .MuiTypography-root': {
							fontWeight: 500,
						},
					},
				},
			})}>
			{menuList?.map((group, idx) => (
				<Fragment key={`menu-group-${idx}`}>
					<List
						component="nav"
						disablePadding
						// caption
						{...(group.caption && {
							subheader: (
								<ListSubheader
									component="div"
									sx={(theme) => ({
										padding: '16px',
										paddingBottom: '4px',
										lineHeight: 'inherit',
										fontSize: '14px',
										color: theme.palette.grey['900'],
									})}>
									{group.caption}
								</ListSubheader>
							),
						})}>
						{group.list.map((item) => {
							// 직접 선택 되거나, 자식이 선택 되거나
							const selected =
								item?.num === currentMenu.num ||
								item.menu === currentMenu.menu;
							const spreaded = spreadMenu.includes(item.menu);
							return (
								<Fragment key={item.menu}>
									<ListItemButton
										selected={selected}
										onClick={() => {
											const path = item?.path;
											if (path) {
												navigate(path);
												return;
											}
											handleOpenMenu(item.menu);
										}}>
										<ListItemIcon>
											{item?.icon ?? <></>}
										</ListItemIcon>
										<ListItemText primary={item.title} />
										{item?.children &&
											(spreaded ? (
												<IcChevronUp
													width="16"
													height="16"
													viewBox="0 0 24 24"
													{...(selected && {
														stroke: theme.palette
															.primary.main,
													})}
												/>
											) : (
												<IcChevronDown
													width="16"
													height="16"
													viewBox="0 0 24 24"
												/>
											))}
									</ListItemButton>
									{/* 2 depth */}
									{item?.children &&
										item?.children.map((child) => {
											const childSelected =
												child?.num === currentMenu.num;
											return (
												<Collapse
													key={child.title}
													in={spreaded}
													timeout="auto">
													<List
														component="div"
														disablePadding>
														<ListItemButton
															selected={
																childSelected
															}
															onClick={() =>
																navigate(
																	child.path
																)
															}>
															<ListItemText
																primary={
																	child.title
																}
															/>
														</ListItemButton>
													</List>
												</Collapse>
											);
										})}
								</Fragment>
							);
						})}
					</List>
					<Divider />
				</Fragment>
			))}
		</Drawer>
	);
}

export default Sidebar;
