import React from 'react';
import {Controller, Scene} from 'react-scrollmagic';
import {Tween, Timeline} from 'react-gsap';
import {
	brandCardBg,
	brandCardBg2x,
	brandCardBgMobile,
	brandCardBgMobile2x,
} from '@/assets/images/index';

function BrandCardDesignSection() {
	const screenWidth = window.innerWidth;
	return (
		<section className="section brand_card_design">
			<Controller vertical={true}>
				<Scene
					triggerHook="onLeave"
					duration={screenWidth > 825 ? 6000 : 4000}
					pin>
					{(progress) =>
						screenWidth > 825 ? (
							// PC 버전
							<div className="brand_card_design_container">
								<Timeline totalProgress={progress} paused>
									<Tween
										from={{opacity: 0}}
										to={{opacity: 1}}>
										<img
											src={brandCardBg}
											srcSet={`${brandCardBg} 1x, ${brandCardBg2x} 2x`}
											alt="brandCard-Bg"
											className={'brand_card_bg'}
										/>
									</Tween>
								</Timeline>

								<Timeline
									totalProgress={progress}
									target={
										<div className="section_title_box brand_design">
											<span className="section_category green">
												브랜드 개런티 디자인
											</span>
											<h6 className="section_title">
												나만의 브랜드를 품은
												<br />
												다채로운 개런티 디자인
											</h6>
										</div>
									}
									paused>
									<Tween
										from={{y: '140px', opacity: 0}}
										to={{y: '80px', opacity: 1}}
									/>

									<div className="brand_card_wrap">
										<Timeline
											target={
												<>
													<video
														playsInline
														controls={false}
														loop
														autoPlay
														muted
														width="328"
														height="512"
														className="brand_card">
														<source
															src={`${STATIC_URL}/files/video/video_homepage_pearl_backen_card.mp4`}
															type="video/mp4"
														/>
													</video>
													<video
														playsInline
														controls={false}
														loop
														autoPlay
														muted
														width="328"
														height="512"
														className="brand_card">
														<source
															src={`${STATIC_URL}/files/video/video_homepage_pisalon_card.mp4`}
															type="video/mp4"
														/>
													</video>
													<video
														playsInline
														controls={false}
														loop
														autoPlay
														muted
														width="328"
														height="512"
														className="brand_card">
														<source
															src={`${STATIC_URL}/files/video/video_homepage_talli_card.mp4`}
															type="video/mp4"
														/>
													</video>
												</>
											}>
											<Tween
												from={{opacity: 0, y: '140px'}}
												to={{opacity: 1, y: '80px'}}
												target={0}
											/>
											<Tween
												from={{opacity: 0, y: '140px'}}
												to={{opacity: 1, y: '80px'}}
												target={1}
											/>
											<Tween
												from={{opacity: 0, y: '140px'}}
												to={{opacity: 1, y: '80px'}}
												target={2}
											/>
										</Timeline>
									</div>
								</Timeline>
							</div>
						) : (
							// 모바일 버전
							<div className="brand_card_design_container">
								<Timeline totalProgress={progress} paused>
									<Tween
										from={{opacity: 0}}
										to={{opacity: 1}}>
										<img
											src={brandCardBgMobile}
											srcSet={`${brandCardBgMobile} 1x, ${brandCardBgMobile2x} 2x`}
											alt="brandCard-Bg"
											className={'brand_card_bg'}
										/>
										{/* <img src={brandCardBg} srcSet={`${brandCardBg} 1x, ${brandCardBg2x} 2x`} alt='brandCard-Bg' className={'brand_card_bg'} /> */}
									</Tween>
								</Timeline>

								<Timeline
									totalProgress={progress}
									target={
										<div className="section_title_box brand_design">
											<span className="section_category green">
												브랜드 개런티 디자인
											</span>
											<h6 className="section_title">
												나만의 브랜드를 품은
												<br />
												다채로운 개런티 디자인
											</h6>
										</div>
									}
									paused>
									<Tween
										from={{y: '140px', opacity: 0}}
										to={{y: '70px', opacity: 1}}
									/>

									<div className="brand_card_wrap">
										<Timeline
											target={
												<>
													<video
														playsInline
														controls={false}
														loop
														autoPlay
														muted
														width="328"
														height="512"
														className="brand_card first">
														<source
															src={`${STATIC_URL}/files/video/video_homepage_pisalon_card.mp4`}
															type="video/mp4"
														/>
													</video>
													<video
														playsInline
														controls={false}
														loop
														autoPlay
														muted
														width="328"
														height="512"
														className="brand_card second">
														<source
															src={`${STATIC_URL}/files/video/video_homepage_pearl_backen_card.mp4`}
															type="video/mp4"
														/>
													</video>
													<video
														playsInline
														controls={false}
														loop
														autoPlay
														muted
														width="328"
														height="512"
														className="brand_card third">
														<source
															src={`${STATIC_URL}/files/video/video_homepage_talli_card.mp4`}
															type="video/mp4"
														/>
													</video>
												</>
											}>
											<Tween
												from={{opacity: 0}}
												to={{opacity: 1}}
											/>
											<Tween
												from={{left: '0px'}}
												to={{left: '0px'}}
												target={0}
											/>
											<Tween
												from={{left: '0px'}}
												to={{left: '-492px'}}
												target={1}
											/>
											<Tween
												from={{right: '0px'}}
												to={{right: '-492px'}}
												target={2}
											/>
										</Timeline>
									</div>
								</Timeline>
							</div>
						)
					}
				</Scene>
			</Controller>
		</section>
	);
}

export default BrandCardDesignSection;
