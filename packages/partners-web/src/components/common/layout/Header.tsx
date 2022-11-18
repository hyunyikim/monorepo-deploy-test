import {useMemo} from 'react';
import {ButtonBase, AppBar, Toolbar} from '@mui/material';

import {
	ImgLogoVirclePartners,
	ImgLogoVirclePartners2x,
	ImgLogoVirclePartnersWhite,
	ImgLogoVirclePartnersWhite2x,
} from '@/assets/images';

import HeaderProfile from '@/components/common/layout/HeaderProfile';

import {HEADER_HEIGHT} from '@/data';
import {goToParentUrl} from '@/utils';
import {useGetPartnershipInfo} from '@/stores/partnership.store';

interface Props {
	backgroundColor?: 'white' | 'transparent';
	borderBottom?: boolean;
}

function Header({backgroundColor = 'white', borderBottom = true}: Props) {
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

	const {data} = useGetPartnershipInfo();

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
					minWidth: '100%',
					height: 'inherit',
					margin: 'auto',
					justifyContent: 'space-between',
				},
			}}>
			<Toolbar
				sx={{
					width: '100%',
				}}>
				<ButtonBase
					disableRipple
					onClick={() => {
						goToParentUrl('/dashboard');
					}}>
					<img
						src={logoImage.src}
						srcSet={logoImage.srcSet}
						alt="logo"
						width={172}
					/>
				</ButtonBase>
				{data && <HeaderProfile data={data} />}
			</Toolbar>
		</AppBar>
	);
}

export default Header;
