import React, {useState} from 'react';
import styled from '@emotion/styled';
import {css, keyframes} from '@emotion/react';

// import {Swiper, SwiperSlide} from 'swiper/react';
// import SwiperCore, {Navigation, FreeMode} from 'swiper';
// import 'swiper/swiper.min.css';

import Carousel from 'nuka-carousel';

import {
	newsThumnail9,
	newsThumnail9_2x,
	newsThumnail8,
	newsThumnail8_2x,
	newsThumnail7,
	newsThumnail7_2x,
	newsThumnail6,
	newsThumnail6_2x,
	newsThumnail5,
	newsThumnail5_2x,
	newsThumnail4,
	newsThumnail4_2x,
	newsThumnail3,
	newsThumnail3_2x,
	newsThumnail2,
	newsThumnail2_2x,
	newsThumnail1,
	newsThumnail1_2x,
	categoryJewelryCard,
	categoryJewelryCard2x,
	categoryFashionCard,
	categoryFashionCard2x,
	categoryApplianceCard,
	categoryApplianceCard2x,
	categoryWatchCard,
	categoryWatchCard2x,
	categoryLifestyleCard,
	categoryLifestyleCard2x,
	categoryBeautyCard,
	categoryBeautyCard2x,
	circleLogos,
	circleLogos2x,
	plusIcon,
	plusIcon2x,
} from '@/assets/images/homepage/index';

import {sendAmplitudeLog, goToParentUrl} from '@/utils';

function CategoryBrandSection() {
	const screenWidth = window.innerWidth;

	const goToSignup = () => {
		sendAmplitudeLog('homepage_partnerssignup_click', {
			button_title: '버클의 새로운 파트너가 되어 보세요!',
		});

		goToParentUrl('/auth/signup');
	};

	const newsList = [
		{
			title: `매스어답션, 그라운드X와 NFT 보증서 맞손`,
			company: '매일경제',
			date: '2022.11',
			link: `https://n.news.naver.com/article/009/0005048157?sid=105`,
			img: newsThumnail9,
			img2x: newsThumnail9_2x,
		},
		{
			title: `씨엔티테크, 디지털개런티 발급서비스 '버클' 운영사 매스어답션 투자`,
			company: '한국경제',
			date: '2022.10',
			link: `https://www.wowtv.co.kr/NewsCenter/News/Read?articleId=A202210310100`,
			img: newsThumnail8,
			img2x: newsThumnail8_2x,
		},
		{
			title: `[Klip 파트너 스토리] NFT 디지털 보증서로 유통 선순환을 만드는 ‘매스어답션’`,
			company: 'Ground X',
			date: '2022.10',
			link: `https://medium.com/groundx/klip-%ED%8C%8C%ED%8A%B8%EB%84%88-%EC%8A%A4%ED%86%A0%EB%A6%AC-nft-%EB%94%94%EC%A7%80%ED%84%B8-%EB%B3%B4%EC%A6%9D%EC%84%9C%EB%A1%9C-%EC%9C%A0%ED%86%B5-%EC%84%A0%EC%88%9C%ED%99%98%EC%9D%84-%EB%A7%8C%EB%93%9C%EB%8A%94-%EB%A7%A4%EC%8A%A4%EC%96%B4%EB%8B%B5%EC%85%98-17a1c8b9a38b`,
			img: newsThumnail7,
			img2x: newsThumnail7_2x,
		},
		{
			title: `매스어답션 X LF몰, 디지털 명품 보증 LF개런티 론칭`,
			company: '패션비즈',
			date: '2022.05',
			link: `http://www.fashionbiz.co.kr/TN/?cate=2&recom=2&idx=192070`,
			img: newsThumnail6,
			img2x: newsThumnail6_2x,
		},
		{
			title: 'NFT 진품 보증 솔루션 매스어답션, 패션 마켓 진출',
			company: '패션비즈',
			date: '2022.03',
			link: `http://www.fashionbiz.co.kr/TN/?cate=2&recom=2&idx=190758`,
			img: newsThumnail5,
			img2x: newsThumnail5_2x,
		},
		{
			title: '매스어답션, 블록체인과 NFT로 명품과 가품 가려낸다',
			company: '밴처스퀘어',
			date: '2022.03',
			link: `https://www.venturesquare.net/849982`,
			img: newsThumnail4,
			img2x: newsThumnail4_2x,
		},
		{
			title: '매스어답션, 한국명품감정원과 NFT 디지털 보증서 협력',
			company: '매일경제',
			date: '2022.02',
			link: `https://www.mk.co.kr/news/it/view/2022/02/165705/`,
			img: newsThumnail3,
			img2x: newsThumnail3_2x,
		},
		{
			title: `[Let's 스타트업] 매스어답션, NFT로 명품'짝퉁' 우려 없애`,
			company: '매일경제',
			date: '2022.02',
			link: `https://www.mk.co.kr/news/it/view/2022/02/116144/`,
			img: newsThumnail2,
			img2x: newsThumnail2_2x,
		},
		{
			title: '중고나라, 블록체인 업체 매스어답션과 협력...명품감정 시험 서비스',
			company: '디지털투데이',
			date: '2022.01',
			link: `http://www.digitaltoday.co.kr/news/articleView.html?idxno=431261`,
			img: newsThumnail1,
			img2x: newsThumnail1_2x,
		},
	];

	const imgList = [
		{
			img: categoryJewelryCard,
			img2x: categoryJewelryCard2x,
		},
		{
			img: categoryFashionCard,
			img2x: categoryFashionCard2x,
		},
		{
			img: categoryApplianceCard,
			img2x: categoryApplianceCard2x,
		},
		{
			img: categoryWatchCard,
			img2x: categoryWatchCard2x,
		},
		{
			img: categoryLifestyleCard,
			img2x: categoryLifestyleCard2x,
		},
		{
			img: categoryBeautyCard,
			img2x: categoryBeautyCard2x,
		},
	];

	return (
		<section className="section category_brand">
			<div className="category_brand_container">
				<div className="section_title_box category">
					<span className="section_category">
						브랜드 개런티 디자인
					</span>
					<h6 className="section_title black">
						여러 카테고리의 브랜드들에
						<br />
						활용 할 수 있어요
					</h6>
				</div>

				{screenWidth < 431 ? (
					<div className="category_brand_card_wrap">
						{imgList.map(({img, img2x}, idx) => (
							<img
								key={`category-mobile-${idx}`}
								src={img}
								srcSet={`${img} 1x, ${img2x} 2x`}
								alt="categoryBrandCard"
								className={'category_brand_card'}
							/>
						))}
					</div>
				) : (
					<div className="category_swiper_container">
						<Carousel
							slidesToShow={screenWidth / 388}
							defaultControlsConfig={{
								nextButtonStyle: {
									fontSize: 0,
									transform: 'rotate(180deg)',
									minWidth: '68px',
									minHeight: '68px',
									maxWidth: '68px',
									maxHeight: '68px',
									backgroundSize: 'contain',
									backgroundRepeat: 'no-repeat',
									backdropFilter: 'blur(10px)',
									borderRadius: '50%',

									position: 'absolute',
									right: '60px',
									top: 0,
									bottom: 0,
									margin: 'auto 0',
									zIndex: 5,
									cursor: 'pointer',
								},
								prevButtonStyle: {
									fontSize: 0,
									minWidth: '68px',
									minHeight: '68px',
									maxWidth: '68px',
									maxHeight: '68px',
									backgroundSize: 'contain',
									backgroundRepeat: 'no-repeat',
									backdropFilter: 'blur(10px)',
									borderRadius: '50%',

									position: 'absolute',
									left: '60px',
									top: 0,
									bottom: 0,
									margin: 'auto 0',
									zIndex: 5,
									cursor: 'pointer',
								},
							}}

							// scrollMode={'page' | 'remainder'}
						>
							{imgList.map(({img, img2x}, idx) => (
								<img
									src={img}
									srcSet={`${img} 1x, ${img2x} 2x`}
									alt="categoryBrandCard"
									key={`category-${idx}`}
									className={'category_brand_card'}
								/>
							))}
						</Carousel>

						{/* FIXME: swiper가 되게 만들어주세요!!! */}
						{/* <Swiper
							slidesOffsetBefore={24}
							slidesOffsetAfter={24}
							slidesPerView={screenWidth / 388}
							spaceBetween={20}
							modules={[Navigation, FreeMode]}
							navigation
							freeMode
							className="card_slide_container">
							{imgList.map(({img, img2x}, idx) => (
								<SwiperSlide key={`category-${idx}`}>
									<img src={img} srcSet={`${img} 1x, ${img2x} 2x`} alt="categoryBrandCard" className={'category_brand_card'} />
								</SwiperSlide>
							))}
						</Swiper> */}
					</div>
				)}
			</div>

			{/* 매스어답션 뉴스 섹션 */}
			<div className="category_brand_container last">
				<div className="section_title_box category">
					<span className="section_category">언론보도</span>
					<h6 className="section_title black ">
						언론이 주목하는 버클 소식
					</h6>
				</div>

				{screenWidth < 431 ? (
					<div className="category_brand_card_wrap news">
						{newsList.map(
							({title, company, date, link, img, img2x}, idx) => (
								<a
									href={link}
									target="_blank"
									key={`news-list-mobile-${idx}`}
									rel="noreferrer">
									<div
										className="new_card_box"
										onClick={() => {
											sendAmplitudeLog(
												`homepage_news${idx + 1}_click`,
												{
													button_title: `언론이 주목하는 버클 소식${
														idx + 1
													}`,
												}
											);
										}}>
										<img
											src={img}
											srcSet={`${img} 1x, ${img2x} 2x`}
											alt="categoryBrandCard"
											className="news_img"
										/>

										<div className="news_title_box">
											<span className="news_company">
												{company}
											</span>
											<h4 className="news_title">
												{title}
											</h4>
											<span className="news_date">
												{date}
											</span>
										</div>
									</div>
								</a>
							)
						)}
					</div>
				) : (
					<Carousel
						slidesToShow={screenWidth / 574}
						defaultControlsConfig={{
							nextButtonStyle: {
								fontSize: 0,
								transform: 'rotate(180deg)',
								minWidth: '68px',
								minHeight: '68px',
								maxWidth: '68px',
								maxHeight: '68px',
								backgroundSize: 'contain',
								backgroundRepeat: 'no-repeat',
								backdropFilter: 'blur(10px)',
								borderRadius: '50%',

								position: 'absolute',
								right: '60px',
								top: 0,
								bottom: 0,
								margin: 'auto 0',
								zIndex: 5,
								cursor: 'pointer',
							},
							prevButtonStyle: {
								fontSize: 0,
								minWidth: '68px',
								minHeight: '68px',
								maxWidth: '68px',
								maxHeight: '68px',
								backgroundSize: 'contain',
								backgroundRepeat: 'no-repeat',
								backdropFilter: 'blur(10px)',
								borderRadius: '50%',

								position: 'absolute',
								left: '60px',
								top: 0,
								bottom: 0,
								margin: 'auto 0',
								zIndex: 5,
								cursor: 'pointer',
							},
						}}>
						{newsList.map(
							({title, company, date, link, img, img2x}, idx) => (
								<a
									href={link}
									target="_blank"
									key={`news-list-${idx}`}
									rel="noreferrer">
									<div
										className="new_card_box"
										onClick={() => {
											sendAmplitudeLog(
												`homepage_news${idx + 1}_click`,
												{
													button_title: `언론이 주목하는 버클 소식${
														idx + 1
													}`,
												}
											);
										}}>
										<img
											src={img}
											srcSet={`${img} 1x, ${img2x} 2x`}
											alt="categoryBrandCard"
											className="news_img"
										/>

										<div className="news_title_box">
											<span className="news_company">
												{company}
											</span>
											<h4 className="news_title">
												{title}
											</h4>
											<span className="news_date">
												{date}
											</span>
										</div>
									</div>
								</a>
							)
						)}
					</Carousel>

					// FIXME: swiper가 되게 만들어주세요!!!
					// <Swiper
					// 	slidesOffsetBefore={24}
					// 	slidesOffsetAfter={24}
					// 	slidesPerView={screenWidth / 574}
					// 	spaceBetween={20}
					// 	modules={[Navigation, FreeMode]}
					// 	navigation
					// 	freeMode
					// 	className="card_slide_container">
					// 	{newsList.map(({title, company, date, link, img, img2x}, idx) => (
					// 		<SwiperSlide key={`news-list-${idx}`}>
					// 			<a href={link} target="_blank" key={`news-list-${idx}`} rel="noreferrer">
					// 				<div
					// 					className="new_card_box"
					// 					onClick={() => {
					// 						tracking(`homepage_news${idx + 1}_click`, {button_title: `언론이 주목하는 버클 소식${idx + 1}`});
					// 					}}>
					// 					<img src={img} srcSet={`${img} 1x, ${img2x} 2x`} alt="categoryBrandCard" className="news_img" />

					// 					<div className="news_title_box">
					// 						<span className="news_company">{company}</span>
					// 						<h4 className="news_title">{title}</h4>
					// 						<span className="news_date">{date}</span>
					// 					</div>
					// 				</div>
					// 			</a>
					// 		</SwiperSlide>
					// 	))}
					// </Swiper>
				)}
			</div>

			<div className="contents_container content">
				<div className="partners_black_box">
					<h4 className="blackbox_title">
						버클의 새로운
						<br />
						파트너가 되어보세요!
					</h4>

					<div className="logo_box_container">
						{screenWidth > 825 ? (
							<img
								src={circleLogos}
								srcSet={`${circleLogos} 1x, ${circleLogos2x} 2x`}
								alt="brand_circle_logo"
								className="brand_circle_logo"
							/>
						) : (
							// <img src={rollingCircleLogos} srcSet={`${rollingCircleLogos} 1x, ${rollingCircleLogos2x} 2x`} alt='brand_circle_logo' className='brand_circle_rolling_logo'/>
							<div className="brand_circle_rolling_logo" />
						)}

						<div className="btn_plus_box" onClick={goToSignup}>
							<div className="btn_plus_circle">
								<img
									src={plusIcon}
									srcSet={`${plusIcon} 1x, ${plusIcon2x} 2x`}
									alt="plusIcon"
									className="icon_plus"
								/>
								<div className="wave1" />
								<div className="wave2" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default CategoryBrandSection;
