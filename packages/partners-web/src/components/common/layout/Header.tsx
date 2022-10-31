import {Avatar, Box, ButtonBase, Typography} from '@mui/material';

// TODO: icon 교체
import {IconMenu2} from '@tabler/icons';

import {useOpenMenuStore, useViewMenuStore} from '@/stores';
import {sidebarWidth} from '@/data';

import {Logo} from '@/components';
import HeaderProfile from '@/components/common/layout/HeaderProfile';

const headerPaddingLeft = '24px';

function Header() {
	const {open, setOpen} = useOpenMenuStore();

	// TODO: subscribe 필요
	const currentMenu = useViewMenuStore((state) => state.currentMenu());
	return (
		<>
			<Box
				sx={(theme) => ({
					width: `calc(${sidebarWidth} - ${headerPaddingLeft} )`,
					display: 'flex',
					[theme.breakpoints.down('md')]: {
						width: 'auto',
					},
				})}>
				<Box
					sx={{
						display: {xs: 'none', md: 'flex'},
						flexGrow: 1,
						alignItmes: 'center',
					}}>
					<Logo />
				</Box>
				<ButtonBase
					sx={{borderRadius: '8px', overflow: 'hidden'}}
					onClick={() => setOpen(!open)}>
					<Avatar
						variant="rounded"
						sx={(theme) => ({
							cursor: 'pointer',
							borderRadius: '8px',
							width: '34px',
							height: '34px',
							fontSize: '1.2rem',
							transition: 'all .2s ease-in-out',
							background: theme.palette.primary.light,
							color: theme.palette.primary.dark,
							'&:hover': {
								background: theme.palette.primary.main,
								color: theme.palette.primary.light,
							},
						})}
						// onClick={handleLeftDrawerToggle}
						color="inherit">
						<IconMenu2 stroke={1.5} size="1.3rem" />
					</Avatar>
				</ButtonBase>
			</Box>
			<Box sx={{pl: 2, display: {xs: 'block', md: 'none'}}}>
				<Typography
					component="h2"
					variant="h2"
					color="inherit"
					sx={{fontSize: '20px'}}>
					{currentMenu.title}
				</Typography>
			</Box>
			{/* <div className={classes.grow} /> */}
			<HeaderProfile />
		</>
	);
}

export default Header;
