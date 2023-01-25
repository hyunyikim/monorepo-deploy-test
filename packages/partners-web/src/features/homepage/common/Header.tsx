import React, {useEffect, useState} from 'react';
import {debounce, throttle} from 'lodash';
import {useLoginStore} from '@/stores';
import {goToParentUrl, sendAmplitudeLog} from '@/utils';
// import Dialog from '@/components/common/Dialog';
import {Dialog} from '@mui/material';

// import img
import {
	hamburgerBar,
	hamburgerBar2x,
	blackHamburgerBar,
	blackHamburgerBar2x,
	homepageHeaderLogo,
	homepageHeaderLogo2x,
	homepageHeaderBlackLogo,
	homepageHeaderBlackLogo2x,
	closeBtn,
	closeBtn2x,
	blackCloseBtn,
	blackCloseBtn2x,
} from '@/assets/images/index';
import {IcClose} from '@/assets/icon/index';

// import closeBtn from '../../assets/images/homepage/img_header_close.png';
// import closeBtn2x from '../../assets/images/homepage/img_header_close@2x.png';

interface openEmailModalProps {
	openEmailModal(): void;
	bgColor?: 'white' | 'black';
}

function HomepageHeader({
	openEmailModal,
	bgColor = 'black',
}: openEmailModalProps) {
	const [openBurgerBar, setOpenBurgerBar] = useState(false);
	let preScrollPosition = 0;
	const [headerState, setHeaderState] = useState('top');
	const isLogin = useLoginStore((state) => state.isLogin)();
	const token = useLoginStore((state) => state.token);

	const clickLogo = () => {
		sendAmplitudeLog('homepage_logo_click', {
			button_title: '버클 로고 클릭',
		});
		goToParentUrl('/home');
		window.scrollTo(0, 0);
	};

	const goToPage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const path: string = e.target.dataset.path;

		switch (path) {
			case 'auth/login':
				sendAmplitudeLog('homepage_login_click', {
					button_title: '로그인 클릭',
				});
				break;
			case 'auth/signup':
				sendAmplitudeLog('homepage_signup_click', {
					button_title: '무료로 가입하기 클릭',
				});
				break;
			case 'price':
				sendAmplitudeLog('homepage_pricing_click', {
					button_title: '가격안내 클릭',
				});
				break;
			case 'dashboard':
				sendAmplitudeLog('homepage_dashboard_click', {
					button_title: '대시보드로 이동하기 클릭',
				});
				break;

			default:
				break;
		}

		if (typeof path === 'string') {
			goToParentUrl(path);
		}
	};

	const hamburgerBarHandler = () => {
		setOpenBurgerBar((pre) => !pre);
	};

	const scrollHandlerDebounce = () => {
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

	useEffect(() => {
		window.addEventListener('scroll', debounce(scrollHandlerDebounce, 20));
		return () => {
			window.removeEventListener(
				'scroll',
				debounce(scrollHandlerDebounce, 20)
			);
		};
	}, []);

	return (
		<>
			<div
				className={`homepage_header_container ${headerState} ${bgColor}`}>
				<div className="inner_wrap">
					<ul className="header_list_box">
						<li>
							<img
								onClick={clickLogo}
								src={
									bgColor === 'white'
										? homepageHeaderBlackLogo
										: homepageHeaderLogo
								}
								srcSet={
									bgColor === 'white'
										? `${homepageHeaderBlackLogo} 1x, ${homepageHeaderBlackLogo2x} 2x`
										: `${homepageHeaderLogo} 1x, ${homepageHeaderLogo2x} 2x`
								}
								className="header_logo"
								alt="logo"
							/>
						</li>

						<ul
							className={`header_list_container ${
								openBurgerBar ? 'pop' : ''
							}`}>
							<li
								className="header_list"
								onClick={() => {
									sendAmplitudeLog('homepage_blog_click', {
										button_title: '블로그 클릭',
									});
								}}>
								<a
									href="https://guide.vircle.co.kr/team"
									target="_blank"
									rel="noreferrer" /* className='faq_link' */
								>
									블로그
								</a>
							</li>
							<li
								className="header_list"
								onClick={() => {
									sendAmplitudeLog('homepage_team_click', {
										button_title: '버클팀 클릭',
									});
								}}>
								<a
									href="https://guide.vircle.co.kr/team"
									target="_blank"
									rel="noreferrer" /* className='faq_link' */
								>
									버클팀
								</a>
							</li>

							<li
								className="header_list"
								data-path="price"
								onClick={goToPage}>
								가격안내
							</li>

							<li
								className="header_list"
								onClick={() => {
									sendAmplitudeLog(
										'homepage_introduction_click',
										{
											button_title: '도입문의 클릭',
										}
									);
									openEmailModal();
								}}>
								도입문의
							</li>
						</ul>
					</ul>

					{isLogin ? (
						<ul
							className={`header_list_box login ${
								openBurgerBar ? 'pop' : ''
							}`}>
							<li>
								<button
									className="btn_signup"
									data-path="dashboard"
									onClick={goToPage}>
									대시보드로 이동하기
								</button>
							</li>
						</ul>
					) : (
						<ul
							className={`header_list_box login ${
								openBurgerBar ? 'pop' : ''
							}`}>
							<li
								className="header_list"
								data-path="auth/login"
								onClick={goToPage}>
								로그인
							</li>
							<li>
								<button
									className="btn_signup"
									data-path="auth/signup"
									onClick={goToPage}>
									무료로 가입하기
								</button>
							</li>
						</ul>
					)}

					{!openBurgerBar ? (
						<img
							className="hamburger_bar"
							onClick={hamburgerBarHandler}
							src={
								bgColor === 'white'
									? blackHamburgerBar
									: hamburgerBar
							}
							srcSet={
								bgColor === 'white'
									? `${blackHamburgerBar} 1x, ${blackHamburgerBar2x} 2x`
									: `${hamburgerBar} 1x, ${hamburgerBar2x} 2x`
							}
							alt="hamburgerBar"
						/>
					) : (
						<img
							className="hamburger_bar"
							onClick={hamburgerBarHandler}
							src={
								bgColor === 'white' ? blackCloseBtn : closeBtn2x
							}
							srcSet={
								bgColor === 'white'
									? `${blackCloseBtn} 1x, ${blackCloseBtn2x} 2x`
									: `${closeBtn2x} 1x, ${closeBtn2x} 2x`
							}
							alt="close"
						/>
					)}
				</div>
			</div>

			<Dialog open={openBurgerBar} sx={{zIndex: 999}} />
		</>
	);
}

export default HomepageHeader;
