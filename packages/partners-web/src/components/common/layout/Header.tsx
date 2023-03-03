import {useMemo, useState} from 'react';
import {ButtonBase, AppBar, Toolbar, Stack} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {
	ImgLogoVirclePartners,
	ImgLogoVirclePartners2x,
	ImgLogoVirclePartnersWhite,
	ImgLogoVirclePartnersWhite2x,
} from '@/assets/images';

import HeaderProfile from '@/components/common/layout/HeaderProfile';
import GuaranteeCheckTooltip from '@/components/common/layout/GuaranteeCheckTooltip';

import {HEADER_HEIGHT} from '@/data';

import {useGetPartnershipInfo} from '@/stores/partnership.store';
import GuaranteeInfoBox from './GuaranteeInfoBox';

interface Props {
	backgroundColor?: 'white' | 'transparent';
	borderBottom?: boolean;
}

function Header({backgroundColor = 'white', borderBottom = true}: Props) {
	const navigate = useNavigate();
	let preScrollPosition = 0;
	const [headerState, setHeaderState] = useState('top');

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

	const transparentBackgroundHandler = useMemo(() => {
		return {
			background: headerState === 'top' ? 'transparent' : 'white',
			logo:
				headerState === 'top'
					? ImgLogoVirclePartnersWhite
					: ImgLogoVirclePartners,
			logo2x:
				headerState === 'top'
					? ImgLogoVirclePartnersWhite2x
					: ImgLogoVirclePartners2x,
		};
	}, [headerState]);

	const scrollHandlerDebounce = (e) => {
		const liveScrollPosition = window.scrollY;

		if (liveScrollPosition === 0) {
			setHeaderState('top');
		} else if (liveScrollPosition - preScrollPosition < 0) {
			setHeaderState('');
		} else if (liveScrollPosition - preScrollPosition > 0) {
			// 스크롤 내렸을때,
			setHeaderState('scrolling_down');
		}

		preScrollPosition = liveScrollPosition;
	};

	// useEffect(() => {
	// 	window.addEventListener('scroll', debounce(scrollHandlerDebounce, 20));

	// 	return () => {
	// 		window.removeEventListener(
	// 			'scroll',
	// 			debounce(scrollHandlerDebounce, 20)
	// 		);
	// 	};
	// }, []);

	return (
		<AppBar
			position="fixed"
			sx={{
				height: HEADER_HEIGHT,
				backgroundColor:
					backgroundColor === 'transparent'
						? transparentBackgroundHandler.background
						: backgroundColor,
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
						navigate('/dashboard');
					}}>
					<img
						src={
							backgroundColor === 'transparent'
								? transparentBackgroundHandler.logo
								: logoImage.src
						}
						srcSet={
							backgroundColor === 'transparent'
								? transparentBackgroundHandler.logo2x
								: logoImage.srcSet
						}
						alt="logo"
						width={100}
					/>
				</ButtonBase>
				<Stack flexDirection="row" alignItems="center">
					<GuaranteeCheckTooltip />
					<GuaranteeInfoBox />
					{data && <HeaderProfile data={data} />}
				</Stack>
			</Toolbar>
		</AppBar>
	);
}

export default Header;
