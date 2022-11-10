import {ButtonBase, AppBar, Toolbar} from '@mui/material';

import {
	ImgLogoVirclePartners,
	ImgLogoVirclePartners2x,
	ImgLogoVirclePartnersWhite,
	ImgLogoVirclePartnersWhite2x,
} from '@/assets/images';
import {useMemo} from 'react';

import HeaderProfile from '@/components/common/layout/HeaderProfile';

import {HEADER_HEIGHT, PARTIAL_PAGE_MAX_WIDTH} from '@/data';
import {goToParentUrl} from '@/utils';

const HEADER_PADDING = '16px';
interface Props {
	fullPage?: boolean;
	backgroundColor?: 'white' | 'transparent';
	borderBottom?: boolean;
}

function Header({
	fullPage = true,
	backgroundColor = 'white',
	borderBottom = true,
}: Props) {
	const logoImage = useMemo(() => {
		return {
			src:
				backgroundColor === 'white'
					? ImgLogoVirclePartners
					: ImgLogoVirclePartnersWhite,
			srcSet:
				backgroundColor === 'white'
					? ImgLogoVirclePartners2x
					: ImgLogoVirclePartnersWhite2x,
		};
	}, [backgroundColor]);

	return (
		<AppBar
			position="fixed"
			sx={{
				height: HEADER_HEIGHT,
				backgroundColor: backgroundColor,
				boxShadow: 'none',
				...(borderBottom && {
					borderBottomWidth: '1px',
					borderBottomStyle: 'solid',
					borderBottomColor: 'grey.100',
				}),
				'.MuiToolbar-root': {
					// TODO: 반응형 체크
					minWidth: fullPage
						? '100%'
						: `calc(${PARTIAL_PAGE_MAX_WIDTH} + (${HEADER_PADDING} * 2))`,
					height: 'inherit',
					margin: 'auto',
					justifyContent: 'space-between',
				},
			}}>
			<Toolbar>
				<ButtonBase
					disableRipple
					onClick={() => {
						goToParentUrl('/');
					}}>
					<img
						src={logoImage.src}
						srcSet={logoImage.srcSet}
						alt="logo"
						width={172}
					/>
				</ButtonBase>
				{/* {true && <HeaderProfile />} */}
			</Toolbar>
		</AppBar>
	);
}

export default Header;
