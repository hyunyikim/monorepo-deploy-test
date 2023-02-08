import React from 'react';
import {Controller, Scene} from 'react-scrollmagic';
import {Tween, Timeline} from 'react-gsap';
import {
	imgColumn1_2x,
	imgColumn2_2x,
	imgColumn3_2x,
	imgColumn4_2x,
	introLogo,
	introLogo2x,
	phoneFrame,
	alternativeVircle,
	mobileColumnBg,
	phoneFrameMobile,
	headphone,
} from '@/assets/images/homepage/index';

import {sendAmplitudeLog, goToParentUrl} from '@/utils';

interface openEmailModalProps {
	openEmailModal(): void;
}

function IntroSection({openEmailModal}: openEmailModalProps) {
	const screenWidth = window.innerWidth;

	const goToSignup = () => {
		sendAmplitudeLog('homepage_signuptop_click', {
			button_title: '지금 무료로 시작하기',
		});

		goToParentUrl(`/auth/signup`);
	};

	const goToInquiry = () => {
		sendAmplitudeLog('homepage_introductiontop_click', {
			button_title: '도입문의 클릭',
		});

		goToParentUrl(`/inquiry`);
	};

	return (
		<section className="section intro">
			<Controller vertical={true}>
				<Scene
					triggerHook="onLeave"
					duration={screenWidth > 825 ? 5000 : 2}
					pin>
					{(progress) =>
						screenWidth > 825 ? (
							// PC 버전
							<div className="scene_container">
								<div className="bg_container">
									<Timeline
										totalProgress={progress}
										target={
											<div className="column_bg_box">
												<img
													src={imgColumn1_2x}
													srcSet={`${imgColumn1_2x} 1x, ${imgColumn1_2x} 2x`}
													alt="logo"
													className={'column-bg'}
												/>
											</div>
										}
										paused>
										{screenWidth > 825 ? (
											<Tween
												from={{y: '0%'}}
												to={{
													y: '-65%',
													marginRight: '8px',
													borderRadius: '8px',
												}}
											/>
										) : null}
									</Timeline>

									<Timeline
										totalProgress={progress}
										target={
											<div className="column_bg_box">
												<img
													src={imgColumn2_2x}
													srcSet={`${imgColumn2_2x} 1x, ${imgColumn2_2x} 2x`}
													alt="logo"
													className={'column-bg'}
												/>
											</div>
										}
										paused>
										{screenWidth > 825 ? (
											<Tween
												from={{y: '0%'}}
												to={{
													y: '-55%',
													marginRight: '8px',
													borderRadius: '8px',
												}}
											/>
										) : null}
									</Timeline>

									<Timeline
										totalProgress={progress}
										target={
											<div className="column_bg_box">
												<img
													src={imgColumn3_2x}
													srcSet={`${imgColumn3_2x} 1x, ${imgColumn3_2x} 2x`}
													alt="logo"
													className={'column-bg'}
												/>
											</div>
										}
										paused>
										{screenWidth > 825 ? (
											<Tween
												from={{y: '0%'}}
												to={{
													y: '-45%',
													marginRight: '8px',
													borderRadius: '8px',
												}}
											/>
										) : null}
									</Timeline>

									<Timeline
										totalProgress={progress}
										target={
											<div className="column_bg_box">
												<img
													src={imgColumn4_2x}
													srcSet={`${imgColumn4_2x} 1x, ${imgColumn4_2x} 2x`}
													alt="logo"
													className={'column-bg'}
												/>
											</div>
										}
										paused>
										{screenWidth > 825 ? (
											<Tween
												from={{y: '0%'}}
												to={{
													y: '-35%',
													marginRight: '8px',
													borderRadius: '8px',
												}}
											/>
										) : null}
									</Timeline>
								</div>

								<div className="contents_container">
									{/* 핸드폰 이미지 */}
									<Timeline
										totalProgress={progress}
										target={
											<div className="before_intro_container">
												<img
													src={introLogo}
													srcSet={`${introLogo} 1x, ${introLogo2x} 2x`}
													alt="logo"
													className={'intro_Logo'}
												/>
												<h1 className="before_intro_title">
													세상의 모든 가치를 담다
												</h1>
											</div>
										}
										paused>
										<Tween
											from={{opacity: 1}}
											to={{opacity: 0}}
										/>

										{/* 핸드폰 이미지 */}
										<Timeline
											target={
												<div className="animation_box absolute">
													<img
														src={phoneFrame}
														srcSet={`${phoneFrame} 1x, ${phoneFrame} 2x`}
														alt="phone"
														className="phone_frame"
													/>
													<video
														playsInline
														controls={false}
														loop
														autoPlay
														muted
														className="img_vircle_phone">
														<source
															src={`${STATIC_URL}/files/video/video_homepage_vircle_intro.mp4`}
															type="video/mp4"
														/>
														<img
															src={
																alternativeVircle
															}
															srcSet={`${alternativeVircle} 1x, ${alternativeVircle} 2x`}
															alt="alternative_intro_img"
															className="img_vircle_phone"
														/>
													</video>
												</div>
											}>
											<Tween
												from={{opacity: 0}}
												to={{opacity: 1}}
											/>
											<Tween
												from={{
													right: 'calc(50% - 245px)',
													top: 'calc(50% - 338px)',
												}}
												to={{
													right:
														screenWidth > 1200
															? 'calc(100% - 100%)'
															: 'calc(100% - 100% + 80px)',
													top: 'calc(50% - 338px)',
												}}
											/>
										</Timeline>

										{/* 버클 타이틀 영역 */}
										<Timeline
											target={
												<div className="animation_box absolute textarea">
													<div className="title_container">
														<h2 className="intro_title">
															버클, 새로운
															<br />
															브랜드 개런티의 시작
														</h2>

														<h2 className="intro_subtitle">
															세상의 모든 가치를
															담다!
														</h2>
													</div>

													<div className="btn_container">
														<button
															className="btn_intro blue"
															onClick={
																goToSignup
															}>
															지금 무료로 시작하기
														</button>

														<button
															className="btn_intro white"
															onClick={() => {
																sendAmplitudeLog(
																	'homepage_introductiontop_click',
																	{
																		button_title:
																			'도입 문의하기',
																	}
																);
																goToInquiry();
															}}>
															도입 문의하기
														</button>
													</div>
												</div>
											}>
											<Tween
												from={{
													opacity: 0,
													top: 'calc(50% - 82px)',
												}}
												to={{
													opacity: 1,
													top: 'calc(50% - 120px)',
												}}
											/>

											<Tween
												from={{
													top: 'calc(50% - 175px)',
												}}
												to={{top: 'calc(50% - 175px)'}}
											/>
											<Tween
												from={{
													top: 'calc(50% - 175px)',
												}}
												to={{top: 'calc(50% - 175px)'}}
											/>
											<Tween
												from={{
													top: 'calc(50% - 175px)',
												}}
												to={{top: 'calc(50% - 175px)'}}
											/>
										</Timeline>
									</Timeline>
								</div>
							</div>
						) : (
							// Mobile 버전
							<div className="scene_container">
								<div className="bg_container">
									<div className="column_bg_box">
										<img
											src={mobileColumnBg}
											srcSet={`${mobileColumnBg} 1x, ${mobileColumnBg} 2x`}
											alt="logo"
											className={'column_bg'}
										/>
									</div>
								</div>

								<div className="contents_container">
									{/* 버클 타이틀 영역 */}
									<div className="animation_box">
										<div className="title_container">
											<h2 className="intro_title">
												버클, 새로운
												<br />
												브랜드 개런티의 시작
											</h2>

											<h2 className="intro_subtitle">
												세상의 모든 가치를 담다!
											</h2>
										</div>

										<div className="btn_container">
											<button
												className="btn_intro blue"
												onClick={goToSignup}>
												지금 무료로 시작하기
											</button>

											<div className="btn_box">
												<img
													src={headphone}
													srcSet={`${headphone} 1x, ${headphone} 2x`}
													alt="phone"
													className="headphone"
												/>
												<button
													className="btn_intro white"
													onClick={goToInquiry}>
													도입 문의하기
												</button>
											</div>
										</div>
									</div>

									{/* 핸드폰 이미지 */}
									<div className="mobile_animation_box">
										<img
											src={phoneFrameMobile}
											srcSet={`${phoneFrameMobile} 1x, ${phoneFrameMobile} 2x`}
											alt="phone"
											className="phone_frame"
										/>
										<video
											playsInline
											controls={false}
											loop
											autoPlay
											muted
											className="img_vircle_phone">
											<source
												src={`${STATIC_URL}/files/video/video_homepage_vircle_intro.mp4`}
												type="video/mp4"
											/>
											<img
												src={alternativeVircle}
												srcSet={`${alternativeVircle} 1x, ${alternativeVircle} 2x`}
												alt="alternative_intro_img"
												className="img_vircle_phone"
											/>
										</video>
									</div>
								</div>
							</div>
						)
					}
				</Scene>
			</Controller>
		</section>
	);
}

export default IntroSection;
