import React, {useState, useEffect} from 'react';
import {Dialog, Grid, Link, Stack} from '@mui/material';

import {trackingToParent} from '@/utils';

// import {IconX} from '@tabler/icons';
import {IcClose} from '@/assets/icon';
import Button from '@mui/material/Button';
import {
	imgPopupBanner,
	imgPopupBanner2x,
	imgPopupBannerM,
	imgPopupBannerM2x,
} from '@/assets/images/index';

interface StopPaperProps {
	isOpen: boolean;
	closeModal: () => void;
	cookieKey: string;
}

function StopPaperPromotionModal({
	isOpen,
	closeModal,
	cookieKey,
}: StopPaperProps) {
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);

	const handleTodayCloseClick = () => {
		trackingToParent('homepage_promotion_popup_today_close_click', {
			pv_title: '오늘 하루 보지 않기',
		});
		let expires: Date | number = new Date();
		expires = expires.setHours(expires.getHours() + 24);
		localStorage.setItem(cookieKey, new Date(expires).toISOString());
		closeModal();
	};

	const handleGoToPromotionClick = () => {
		trackingToParent('homepage_promotion_popup_cta_click', {
			button_title: '개런티 발급체험 신청하기',
		});
		window.open(`${EVENT_URL}/stop-paper`, '_blank');
		closeModal();
	};

	const closeModalHandler = () => {
		closeModal();
	};

	useEffect(() => {
		trackingToParent('homepage_promotion_popupview', {
			pv_title: '프로모션 이동 팝업 노출',
		});

		window.addEventListener('resize', () =>
			setScreenWidth(window.innerWidth)
		);
		return () => {
			window.removeEventListener('resize', () =>
				setScreenWidth(window.innerWidth)
			);
		};
	}, []);

	return (
		isOpen && (
			<div>
				<Dialog
					open={isOpen}
					scroll={'body'}
					sx={{
						'& .MuiDialog-container': {
							padding: 0,

							'& .MuiPaper-root': {
								width: '100%',
								maxWidth: '866px',
								minWidth: '866px',
								margin: '50px auto',
								padding: '0px',
								position: 'relative',
								background: 'transparent',
								boxShadow: 'none',
								textAlign: 'center',
								'@media screen and (max-width: 825px)': {
									maxWidth: '327px',
									minWidth: '327px',
								},
							},

							'& .MuiDialogContent-root': {
								margin: '0 auto',
							},
						},
					}}
					transitionDuration={500}>
					<Stack
						sx={{
							position: 'absolute',
							top: '52px',
							right: '52px',
							zIndex: '10',
							'@media screen and (max-width: 825px)': {
								top: '18px',
								right: '18px',
							},
						}}>
						<IcClose
							style={{
								cursor: 'pointer',
								color: '#fff',
							}}
							onClick={closeModalHandler}
						/>
					</Stack>

					<Grid
						container
						sx={{
							zIndex: 5,
							padding: '0',
							width: '100%',
							lineHeight: 0,
							textAlign: 'center',

							'& > img': {
								borderRadius: '16px',
							},
						}}>
						{screenWidth > 825 ? (
							<img
								src={imgPopupBanner}
								srcSet={`${imgPopupBanner} 1x, ${imgPopupBanner2x} 2x`}
								alt="#종이멈춰! 디지털로 발급받는 브랜드 보증서"
							/>
						) : (
							<img
								src={imgPopupBannerM}
								srcSet={`${imgPopupBannerM} 1x, ${imgPopupBannerM2x} 2x`}
								alt="#종이멈춰! 디지털로 발급받는 브랜드 보증서"
							/>
						)}
						<Button
							variant="contained"
							sx={{
								cursor: 'pointer',
								height: '60px',
								lineHeight: '60px',
								padding: `0 28px`,
								margin: '-110px auto 0',
								borderRadius: '60px',
								background: '#fff',
								'@media screen and (max-width: 825px)': {
									height: '54px',
									lineHeight: '54px',
									padding: `0 38px`,
									margin: '-80px auto 0',
								},

								'&:hover': {
									background: '#fff',
								},

								'& > span': {
									height: '22px',
									display: 'flex',
									fontSize: '18px',
									lineHeight: '22px',
									fontWeight: 700,
									background:
										'linear-gradient(260.19deg, #9E22FF 19.8%, #E3115D 53.77%)',
									'-webkit-background-clip': 'text',
									'-webkit-text-fill-color': 'transparent',
									backgroundClip: 'text',
									textFillColor: 'transparent',
								},
							}}
							onClick={handleGoToPromotionClick}>
							<span>개런티 발급체험 신청하기</span>
						</Button>
					</Grid>

					<Button
						variant="text"
						component={Link}
						sx={{
							display: 'inline-block',
							margin: '26px auto 0',
							padding: 0,
							color: '#fff',
							textDecoration: 'underline',
							fontSize: '20px',

							'@media screen and (max-width: 825px)': {
								fontSize: '18px',
							},
						}}
						onClick={handleTodayCloseClick}>
						오늘 하루 보지 않기
					</Button>
				</Dialog>
			</div>
		)
	);
}

export default StopPaperPromotionModal;
