import React from 'react';
import styled from '@emotion/styled';
import {css, keyframes} from '@emotion/react';
// import styled from '@emotion/styled/types/base';
import {Controller, Scene} from 'react-scrollmagic';
import {Tween, Timeline} from 'react-gsap';

import {
	klipXvircle,
	klipXvircle2x,
	benefitPhone,
	benefitPhone2x,
	excel,
	excel2x,
	partners,
	partners2x,
	cafeXvircle,
	cafeXvircle2x,
	cafe24,
	cafe24_2x,
	cafeXvircleMobile,
	cafeXvircleMobile2x,
	benefitPhoneMobile,
	benefitPhoneMobile2x,
	partnersMobile,
	partnersMobile2x,
	cafe24Mobile,
	cafe24Mobile_2x,
	conciergeCases,
	conciergeCases2x,
	conciergeCasesMobile,
	conciergeCasesMobile2x,
	users,
	users2x,
	usersMobile,
	usersMobile2x,
} from '@/assets/images/homepage/index';

function GuaranteeDescSection() {
	const screenWidth = window.innerWidth;
	return (
		<>
			<section className="section Guarantee_desc">
				<Controller vertical={true}>
					<Scene
						triggerHook="onLeave"
						duration={screenWidth > 825 ? 15000 : 10000}
						pin>
						{(progress) =>
							screenWidth > 825 ? (
								// PC 버전
								<div className="section_inner">
									<div className="contents_container">
										<div className="Guarantee_desc_title_box">
											개런티 발급과 관리를
											<h6 className="gradient_title">
												손쉽게 할 수 있어요
											</h6>
										</div>

										<div className="Guarantee_benefit_container">
											<Timeline
												totalProgress={progress}
												paused
												target={
													<>
														<div className="Guarantee_benefit_box blue" />
														<div className="benefit_content_text_box klip_X_vircle">
															<img
																src={
																	klipXvircle
																}
																srcSet={`${klipXvircle} 1x, ${klipXvircle2x} 2x`}
																className="benefit_content_logo"
																alt="img_klip_X_vircle"
															/>
															<h4 className="benefit_content_title">
																온라인에서
																손쉽게 개런티를{' '}
																<br />
																발급/관리 할 수
																있어요
															</h4>
															<p className="benefit_content_desc">
																상품을 구매한
																고객에게 카카오
																알림톡을 이용해
																손쉽게 개런티를
																발급되며 발급한
																개런티는 Klip
																지갑에
																보관됩니다.
															</p>
														</div>
														<img
															src={benefitPhone}
															srcSet={`${benefitPhone} 1x, ${benefitPhone2x} 2x`}
															className="benefit_content_img phone"
															alt="phone"
														/>

														{/*  초록박스 3~5 */}
														<div className="Guarantee_benefit_box green" />
														<div className="benefit_content_text_box klip_X_vircle">
															<img
																src={excel}
																srcSet={`${excel} 1x, ${excel2x} 2x`}
																className="benefit_content_logo"
																alt="img_klip_X_vircle"
															/>
															<h4 className="benefit_content_title">
																엑셀 업로드로
																개런티의
																<br />
																대량발급이
																가능해요
															</h4>
															<p className="benefit_content_desc">
																개런티를
																발급할때,
																엑셀파일을
																업로드해 한번에
																여러고객에게
																개런티를 대량
																발급 할 수
																있습니다.
															</p>
														</div>
														<img
															src={partners}
															srcSet={`${partners} 1x, ${partners2x} 2x`}
															className="benefit_content_img"
															alt="phone"
														/>

														{/* 노란박스 6~8 */}
														<div className="Guarantee_benefit_box yellow" />
														<div className="benefit_content_text_box klip_X_vircle">
															<img
																src={
																	cafeXvircle
																}
																srcSet={`${cafeXvircle} 1x, ${cafeXvircle2x} 2x`}
																className="benefit_content_logo"
																alt="img_klip_X_vircle"
															/>
															<h4 className="benefit_content_title">
																주문부터
																발급까지
																버클에서
																<br />
																한번에
																해결하세요
															</h4>
															<p className="benefit_content_desc">
																Cafe24와의
																주문연동을 통해
																고객이 주문시에
																자동으로
																고객에게
																디지털개런티가
																발급됩니다.
															</p>
														</div>
														<img
															src={cafe24}
															srcSet={`${cafe24} 1x, ${cafe24_2x} 2x`}
															className="benefit_content_img"
															alt="phone"
														/>
													</>
												}>
												<Tween
													from={{
														opacity: 0,
														background: '#ffffff',
														zIndex: -1,
													}}
													to={{
														opacity: 1,
														background: '#d6dcff',
														zIndex: -1,
													}}
													target={0}
												/>
												<Tween
													from={{
														opacity: 0,
														top: '129px',
													}}
													to={{
														opacity: 1,
														top: '109px',
													}}
													target={1}
												/>
												<Tween
													from={{opacity: 0}}
													to={{opacity: 1}}
													target={2}
												/>
												{/*  초록박스 5~7 */}
												<Tween
													from={{opacity: 0}}
													to={{opacity: 1}}
													target={3}
												/>
												<Tween
													from={{
														opacity: 0,
														top: '129px',
														zIndex: 6,
													}}
													to={{
														opacity: 1,
														top: '109px',
														zIndex: 6,
													}}
													target={4}
												/>
												<Tween
													from={{
														opacity: 0,
														zIndex: 6,
													}}
													to={{opacity: 1, zIndex: 6}}
													target={5}
												/>
												<Tween
													from={{zIndex: 6}}
													to={{zIndex: 6}}
													target={5}
												/>
												<Tween
													from={{opacity: 0}}
													to={{opacity: 1}}
													target={6}
												/>
												{/* 노란박스 8~12 */}
												<Tween
													from={{
														opacity: 0,
														top: '129px',
														zIndex: 11,
													}}
													to={{
														opacity: 1,
														top: '109px',
														zIndex: 11,
													}}
													target={7}
												/>
												<Tween
													from={{
														opacity: 0,
														zIndex: 11,
													}}
													to={{
														opacity: 1,
														zIndex: 11,
													}}
													target={8}
												/>
											</Timeline>
										</div>
									</div>
								</div>
							) : (
								// Mobile 버전
								<div className="section_inner">
									<div className="contents_container content">
										<div className="Guarantee_desc_title_box">
											개런티 발급과 관리를
											<h6 className="gradient_title">
												손쉽게 할 수 있어요
											</h6>
										</div>

										<div className="Guarantee_benefit_container">
											<Timeline
												totalProgress={progress}
												paused
												target={
													<>
														<div className="Guarantee_benefit_box blue" />
														<div className="benefit_content_text_box klip_X_vircle blue">
															<img
																src={
																	klipXvircle
																}
																srcSet={`${klipXvircle} 1x, ${klipXvircle2x} 2x`}
																className="benefit_content_logo"
																alt="img_klip_X_vircle"
															/>
															<h4 className="benefit_content_title">
																온라인에서
																손쉽게 개런티를{' '}
																<br />
																발급/관리 할 수
																있어요
															</h4>
															<p className="benefit_content_desc">
																상품을 구매한
																고객에게 카카오
																알림톡을 이용해
																손쉽게 개런티를
																발급되며 발급한
																개런티는 Klip
																지갑에
																보관됩니다.
															</p>
														</div>
														<div className="benefit_img_box blue">
															<img
																src={
																	benefitPhoneMobile
																}
																srcSet={`${benefitPhoneMobile} 1x, ${benefitPhoneMobile2x} 2x`}
																className="benefit_content_img phone"
																alt="phone"
															/>
														</div>
														{/*  초록박스 3~5 */}
														<div className="Guarantee_benefit_box green" />
														<div className="benefit_content_text_box klip_X_vircle green">
															<img
																src={excel}
																srcSet={`${excel} 1x, ${excel2x} 2x`}
																className="benefit_content_logo excel"
																alt="img_klip_X_vircle"
															/>
															<h4 className="benefit_content_title">
																엑셀 업로드로
																개런티의
																<br />
																대량발급이
																가능해요
															</h4>
															<p className="benefit_content_desc">
																개런티를
																발급할때,
																엑셀파일을
																업로드해 한번에
																여러고객에게
																개런티를 대량
																발급 할 수
																있습니다.
															</p>
														</div>
														<div className="benefit_img_box green">
															<img
																src={
																	partnersMobile
																}
																srcSet={`${partnersMobile} 1x, ${partnersMobile2x} 2x`}
																className="benefit_content_img mobile_excel"
																alt="phone"
															/>
														</div>
														{/* 노란박스 6~8 */}
														<div className="Guarantee_benefit_box yellow" />
														<div className="benefit_content_text_box klip_X_vircle yellow">
															<img
																src={
																	cafeXvircleMobile
																}
																srcSet={`${cafeXvircleMobile} 1x, ${cafeXvircleMobile2x} 2x`}
																className="benefit_content_logo cafe24"
																alt="img_klip_X_vircle"
															/>
															<h4 className="benefit_content_title">
																주문부터
																발급까지
																버클에서
																<br />
																한번에
																해결하세요
															</h4>
															<p className="benefit_content_desc">
																Cafe24와의
																주문연동을 통해
																고객이 주문시에
																자동으로
																고객에게
																디지털개런티가
																발급됩니다.
															</p>
														</div>
														<div className="benefit_img_box yellow">
															<img
																src={
																	cafe24Mobile
																}
																srcSet={`${cafe24Mobile} 1x, ${cafe24Mobile_2x} 2x`}
																className="benefit_content_img cafe24_mobile"
																alt="phone"
															/>
														</div>
													</>
												}>
												<Tween
													from={{
														opacity: 0,
														background: '#ffffff',
														zIndex: -1,
													}}
													to={{
														opacity: 1,
														background: '#d6dcff',
														zIndex: -1,
													}}
													target={0}
												/>
												<Tween
													from={{opacity: 0}}
													to={{opacity: 1}}
													target={2}
												/>
												<Tween
													from={{
														opacity: 0,
														bottom: '20px',
													}}
													to={{
														opacity: 1,
														bottom: '40px',
													}}
													target={1}
												/>
												<Tween
													from={{zIndex: 3}}
													to={{zIndex: 3}}
													target={1}
												/>
												{/*  초록박스 3~5 */}
												<Tween
													from={{opacity: 0}}
													to={{opacity: 1}}
													target={3}
												/>
												<Tween
													from={{
														opacity: 0,
														zIndex: 6,
													}}
													to={{opacity: 1, zIndex: 6}}
													target={5}
												/>
												<Tween
													from={{
														opacity: 0,
														bottom: '20px',
														zIndex: 7,
													}}
													to={{
														opacity: 1,
														bottom: '40px',
														zIndex: 7,
													}}
													target={4}
												/>
												<Tween
													from={{zIndex: 7}}
													to={{zIndex: 7}}
													target={4}
												/>
												{/* 노란박스 6~8 */}
												<Tween
													from={{opacity: 0}}
													to={{opacity: 1}}
													target={6}
												/>
												<Tween
													from={{
														opacity: 0,
														zIndex: 10,
													}}
													to={{
														opacity: 1,
														zIndex: 10,
													}}
													target={8}
												/>
												<Tween
													from={{
														opacity: 0,
														bottom: '20px',
														zIndex: 12,
													}}
													to={{
														opacity: 1,
														bottom: '40px',
														zIndex: 12,
													}}
													target={7}
												/>
												<Tween
													from={{zIndex: 11}}
													to={{zIndex: 11}}
													target={8}
												/>
											</Timeline>
										</div>
									</div>
								</div>
							)
						}
					</Scene>

					<Scene triggerHook="onLeave" duration={7000} pin>
						{(progress) =>
							screenWidth > 825 ? (
								// PC 버전
								<div className="section_inner">
									<div className="contents_container">
										<div className="Guarantee_desc_title_box">
											버클의 기능들로 고객과의
											<h6 className="gradient_title">
												접점을 확보할 수 있어요
											</h6>
										</div>

										<div className="Guarantee_benefit_container">
											<Timeline
												totalProgress={progress}
												paused
												target={
													<>
														<div className="Guarantee_benefit_box blue" />
														<div className="benefit_content_text_box klip_X_vircle">
															<h6 className="benefit_content_category blue">
																버클 수선•감정
															</h6>
															<h4 className="benefit_content_title">
																감정/수선 관리를
																통해
																<br />
																사후관리를 할 수
																있어요
															</h4>
															<p className="benefit_content_desc">
																발급받은
																개런티를 통해
																감정,수선 신청을
																받고 고객과의
																사후접점을
																확보할 수
																있습니다.
															</p>
														</div>
														<img
															src={conciergeCases}
															srcSet={`${conciergeCases} 1x, ${conciergeCases2x} 2x`}
															className="benefit_content_img concierge"
															alt="phone"
														/>
														{/* 노란박스 3~ */}
														<div className="Guarantee_benefit_box yellow" />
														<div className="benefit_content_text_box klip_X_vircle">
															<h6 className="benefit_content_category yellow">
																버클 고객관리
															</h6>
															<h4 className="benefit_content_title">
																버클 개런티를
																발급받은
																<br />
																고객을 관리할 수
																있어요
															</h4>
															<p className="benefit_content_desc">
																개런티를
																발급받은
																고객들의
																리스트를 관리할
																수 있고,
																멤버십이나
																이벤트를 진행할
																수 있습니다.
															</p>
														</div>
														<img
															src={users}
															srcSet={`${users} 1x, ${users2x} 2x`}
															className="benefit_content_img users"
															alt="users"
														/>
													</>
												}>
												<Tween
													from={{
														opacity: 0,
														background: '#ffffff',
														zIndex: -1,
													}}
													to={{
														opacity: 1,
														background: '#d6dcff',
														zIndex: -1,
													}}
													target={0}
												/>
												<Tween
													from={{
														opacity: 0,
														top: '129px',
													}}
													to={{
														opacity: 1,
														top: '109px',
													}}
													target={1}
												/>
												<Tween
													from={{opacity: 0}}
													to={{opacity: 1}}
													target={2}
												/>
												{/* 노란박스 3~12 */}
												<Tween
													from={{opacity: 0}}
													to={{opacity: 1}}
													target={3}
												/>
												<Tween
													from={{
														opacity: 0,
														top: '129px',
														zIndex: 20,
													}}
													to={{
														opacity: 1,
														top: '109px',
														zIndex: 20,
													}}
													target={4}
												/>
												<Tween
													from={{
														opacity: 0,
														zIndex: 20,
													}}
													to={{
														opacity: 1,
														zIndex: 20,
													}}
													target={5}
												/>
											</Timeline>
										</div>
									</div>
								</div>
							) : (
								// Mobile 버전
								<div className="section_inner">
									<div className="contents_container content">
										<div className="Guarantee_desc_title_box">
											버클의 기능들로 고객과의
											<h6 className="gradient_title">
												접점을 확보할 수 있어요
											</h6>
										</div>

										<div className="Guarantee_benefit_container">
											<Timeline
												totalProgress={progress}
												paused
												target={
													<>
														<div className="Guarantee_benefit_box blue" />
														<div className="benefit_content_text_box klip_X_vircle">
															<h6 className="benefit_content_category blue">
																버클 수선•감정
															</h6>
															<h4 className="benefit_content_title">
																감정/수선 관리를
																통해
																<br />
																사후관리를 할 수
																있어요
															</h4>
															<p className="benefit_content_desc">
																발급받은
																개런티를 통해
																감정,수선 신청을
																받고 고객과의
																사후접점을
																확보할 수
																있습니다.
															</p>
														</div>
														<img
															src={
																conciergeCasesMobile
															}
															srcSet={`${conciergeCasesMobile} 1x, ${conciergeCasesMobile2x} 2x`}
															className="benefit_content_img concierge"
															alt="phone"
														/>

														{/* 노란박스 3~ */}
														<div className="Guarantee_benefit_box yellow" />
														<div className="benefit_content_text_box klip_X_vircle">
															<h6 className="benefit_content_category yellow">
																버클 고객관리
															</h6>
															<h4 className="benefit_content_title">
																버클 개런티를
																발급받은
																<br />
																고객을 관리할 수
																있어요
															</h4>
															<p className="benefit_content_desc">
																개런티를
																발급받은
																고객들의
																리스트를 관리할
																수 있고,
																멤버십이나
																이벤트를 진행할
																수 있습니다.
															</p>
														</div>
														<img
															src={usersMobile}
															srcSet={`${usersMobile} 1x, ${usersMobile2x} 2x`}
															className="benefit_content_img users"
															alt="users"
														/>
													</>
												}>
												<Tween
													from={{
														opacity: 0,
														background: '#ffffff',
														zIndex: -1,
													}}
													to={{
														opacity: 1,
														background: '#d6dcff',
														zIndex: -1,
													}}
													target={0}
												/>
												<Tween
													from={{opacity: 0}}
													to={{opacity: 1}}
													target={2}
												/>
												<Tween
													from={{
														opacity: 0,
														bottom: '20px',
													}}
													to={{
														opacity: 1,
														bottom: '40px',
													}}
													target={1}
												/>
												<Tween
													from={{zIndex: 10}}
													to={{zIndex: 10}}
													target={1}
												/>
												{/* 노란박스 3~12 */}
												<Tween
													from={{opacity: 0}}
													to={{opacity: 1}}
													target={3}
												/>
												<Tween
													from={{
														opacity: 0,
														zIndex: 20,
													}}
													to={{
														opacity: 1,
														zIndex: 20,
													}}
													target={5}
												/>
												<Tween
													from={{
														opacity: 0,
														bottom: '20px',
														zIndex: 20,
													}}
													to={{
														opacity: 1,
														bottom: '40px',
														zIndex: 20,
													}}
													target={4}
												/>
											</Timeline>
										</div>
									</div>
								</div>
							)
						}
					</Scene>
				</Controller>
			</section>
		</>
	);
}

export default GuaranteeDescSection;
