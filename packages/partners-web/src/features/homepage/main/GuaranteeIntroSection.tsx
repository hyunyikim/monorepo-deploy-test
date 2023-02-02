import React from 'react';
import {Controller, Scene} from 'react-scrollmagic';
import {Tween, Timeline} from 'react-gsap';

function GuaranteeIntroSection() {
	const screenWidth = window.innerWidth;
	return (
		<section className="section GuaranteeIntro">
			<Controller vertical={true}>
				<Scene
					triggerHook="onLeave"
					duration={screenWidth > 825 ? 3000 : 2000}
					pin>
					{(progress) =>
						screenWidth > 825 ? (
							// pc 버전
							<div className="contents_container1">
								<div className="GuaranteeIntro_title_box">
									<Timeline
										totalProgress={progress}
										paused
										target={
											<>
												<h2 className="GuaranteeIntro_title black">
													발급은
												</h2>
												<h2 className="GuaranteeIntro_title blue">
													&nbsp;간편하게,
												</h2>
												<h2 className="GuaranteeIntro_title black">
													&nbsp;보증은
												</h2>
												<h2 className="GuaranteeIntro_title blue">
													&nbsp;확실하게
												</h2>

												<div className="GuaranteeIntro_subtitle">
													버클의 디지털 개런티는,
													종이보증서를 완벽히 대체하고
													<br />
													상품정보, 이력, 중고거래
													지원등 다양한 서비스를
													제공합니다.
												</div>
											</>
										}>
										<Tween
											from={{
												opacity: 1,
												fontSize: '54px',
											}}
											to={{opacity: 1, fontSize: '54px'}}
											target={0}
										/>
										<Tween
											from={{width: '0px'}}
											to={{width: '235px'}}
											target={1}
										/>
										<Tween from={{}} to={{}} target={1} />
										<Tween from={{}} to={{}} target={1} />

										<Tween
											from={{
												opacity: 0,
												y: '20px',
												fontSize: '0px',
											}}
											to={{
												opacity: 1,
												y: '0px',
												fontSize: '54px',
											}}
											target={1}
										/>
										<Tween
											from={{opacity: 0, fontSize: '0px'}}
											to={{opacity: 1, fontSize: '54px'}}
											target={2}
										/>
										<Tween
											from={{width: '0px'}}
											to={{width: '225px'}}
											target={3}
										/>
										<Tween
											from={{
												opacity: 0,
												y: '20px',
												fontSize: '0px',
											}}
											to={{
												opacity: 1,
												y: '0px',
												fontSize: '54px',
											}}
											target={3}
										/>
										<Tween
											from={{
												opacity: 0,
												bottom: '-150px',
											}}
											to={{opacity: 1, bottom: '-90px'}}
											target={4}
										/>
										<Tween
											from={{bottom: '-90px'}}
											to={{bottom: '-90px'}}
											target={4}
										/>
										<Tween
											from={{bottom: '-90px'}}
											to={{bottom: '-90px'}}
											target={4}
										/>
									</Timeline>
								</div>
							</div>
						) : (
							// 모바일 버전
							<div className="contents_container1">
								<div className="GuaranteeIntro_title_box">
									<Timeline
										totalProgress={progress}
										paused
										target={
											<>
												<div>
													<h2 className="GuaranteeIntro_title black">
														발급은
													</h2>
													<h2 className="GuaranteeIntro_title blue">
														&nbsp;간편하게
													</h2>
												</div>

												<div>
													<h2 className="GuaranteeIntro_title black">
														보증은
													</h2>
													<h2 className="GuaranteeIntro_title blue">
														&nbsp;확실하게
													</h2>
												</div>

												<div className="GuaranteeIntro_subtitle">
													버클의 디지털 개런티는,
													종이보증서를 완벽히 대체하고
													<br />
													상품정보, 이력, 중고거래
													지원등 다양한 서비스를
													제공합니다.
												</div>
											</>
										}>
										<Tween
											from={{opacity: 0, y: '20px'}}
											to={{opacity: 1, y: '0px'}}
											target={0}
										/>
										<Tween
											from={{opacity: 0, y: '20px'}}
											to={{opacity: 1, y: '0px'}}
											target={1}
										/>
										<Tween
											from={{opacity: 0, y: '20px'}}
											to={{opacity: 1, y: '0px'}}
											target={2}
										/>
									</Timeline>
								</div>
							</div>
						)
					}
				</Scene>
			</Controller>
		</section>
	);
}

export default GuaranteeIntroSection;
