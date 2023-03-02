import {useEffect, useState} from 'react';

import {Stack, Box, Typography} from '@mui/material';

import DashboardSection from '@/features/dashboard/common/DashboardSection';
import SectionBox from '@/features/dashboard/common/SectionBox';
import SectionTitleComponent from '@/features/dashboard/common/SectionTitleComponent';
import {IcChevronRight, IcNewInRedCircle} from '@/assets/icon';
import {IcCarouselArrow} from '@/assets/images/homepage/index';
import Carousel from 'nuka-carousel';
import {
	imgKakaoTip,
	imgRepairTip,
	imgCafe24Tip,
	imgBrandStoryString925,
	imgBrandStoryButti,
	imgBrandStoryFotton,
	imgBrandStoryTheidentity,
} from '@/assets/images';
import {getNoticeTableList} from '@/api/dashboard';
import {sendAmplitudeLog} from '@/utils';
import AtagComponent from '@/components/atoms/AtagComponent';
import {useNavigate} from 'react-router-dom';

interface NoticeInterface {
	Date: string;
	Name: string;
	id: string;
}
function DashboardInfoCentreSection() {
	const navigate = useNavigate();
	const [screenWidth, setScreenWidth] = useState<number>(1201);
	const [noticeList, setNoticeList] = useState<NoticeInterface[] | []>([]);

	const goToNoticeList = () => {
		window.open('https://guide.vircle.co.kr/notice');
	};
	const openNotice = (_idx: string | number) => {
		let urlIdx;

		if (_idx) {
			sendAmplitudeLog('dashboard_notice_click', {
				button_title: '해당 공지사항 상세로 이동',
			});
			if (_idx < 10) {
				urlIdx = '0' + _idx;
			} else {
				urlIdx = _idx;
			}

			return window.open(`https://guide.vircle.co.kr/notice/${urlIdx}`);
		}
	};

	const isNewNotice = (_date: string) => {
		if (_date) {
			const currentTime = new Date().getTime();
			const postedTime = new Date(_date).getTime();

			const timeDifference = currentTime - postedTime;
			const ms = 1000;
			const min = 60;
			const hour = 60;
			const day = 24;

			if (timeDifference / ms / min / hour / day <= 14) {
				return true;
			}

			return false;
		}
		return false;
	};

	const getNotionDate = (li: NoticeInterface) => {
		let result = '';
		Object.keys(li).map((key) => {
			if (key.includes('Date')) {
				return (result = li[key]);
			}
		});

		return result;
	};

	const getNoticeList = async () => {
		try {
			const noticeListRes: NoticeInterface[] = await getNoticeTableList();
			if (noticeListRes && noticeListRes.length > 0) {
				setNoticeList([...noticeListRes?.reverse()]);
			}
		} catch (e) {
			console.log('e', e);
		}
	};

	const serviceTipList = [
		{
			title: (
				<>
					카페24 쇼핑몰 연동하고
					<br /> 자동 개런티 발급하기
				</>
			),
			img: imgCafe24Tip,
			link: '/b2b/interwork/cafe24',
			taxoInfo: {
				eventName: 'dashboard_tip_cafe24_click',
				eventProperty: '서비스 연동관리>카페24 상세로 이동',
			},
		},
		{
			title: (
				<>
					우리 브랜드 카카오톡 채널로 <br />
					개런티 알림톡 보내기
				</>
			),
			img: imgKakaoTip,
			link: '/b2b/interwork/kakao',
			taxoInfo: {
				eventName: 'dashboard_tip_kakao_click',
				eventProperty: '서비스 연동관리>카카오 알림톡 상세로 이동',
			},
		},
		{
			title: (
				<>
					수선신청도 버클에서 <br />한 번에 관리하기
				</>
			),
			img: imgRepairTip,
			link: '/b2b/interwork/repair',
			taxoInfo: {
				eventName: 'dashboard_tip_repair_click',
				eventProperty: '서비스 연동관리>수선신청 관리 상세로 이동',
			},
		},
	];

	const brandExperienceList = [
		{
			title: '부띠, 제주 면세점 매출 1위한 비결',
			subtitle: (
				<>
					CS팀 직원의 업무 효율 90% 향상 시키고
					<br /> 고객응대에 더 힘써 매출을 올릴 수 있었어요.
				</>
			),
			img: imgBrandStoryButti,
			link: 'https://blog.naver.com/vircle_/222922148529',
			taxoInfo: {
				eventName: 'dashboard_brand_butti',
				eventProperty: '해당 블로그 링크로 이동',
			},
		},
		{
			title: '스팅925, 고객과 접점을 만들다',
			subtitle: (
				<>
					주얼리 종이 보증서를 디지털로 바꾸고
					<br /> 고객과의 신뢰를 높이고 있어요.
				</>
			),
			img: imgBrandStoryString925,
			link: 'https://blog.naver.com/vircle_/222929107626',
			taxoInfo: {
				eventName: 'dashboard_brand_sting925',
				eventProperty: '해당 블로그 링크로 이동',
			},
		},
		{
			title: (
				<>
					더아이덴티티프로젝트, 힙한 <br />
					카드로 MZ세대 취향 저격
				</>
			),
			subtitle: <>SNS에 인증하고 싶은 개런티 카드.</>,
			img: imgBrandStoryTheidentity,
			link: 'https://blog.naver.com/vircle_/222924174820',
			taxoInfo: {
				eventName: 'dashboard_brand_theidentity',
				eventProperty: '해당 블로그 링크로 이동',
			},
		},
		{
			title: '포튼가먼트, 정장에도 디지털 감성을 담다!',
			subtitle: '고객에게 신뢰를 주고, 시대의 흐름을 맞춰가는 방법',
			img: imgBrandStoryFotton,
			link: 'https://blog.naver.com/vircle_/222938032395',
			taxoInfo: {
				eventName: 'dashboard_brand_fotton',
				eventProperty: '해당 블로그 링크로 이동',
			},
		},
	];

	const brandExperienceCarousel = document.querySelector(
		'.slider-frame.brand_experience_carousel'
	);

	const screenWidthHandler = () => {
		const targetCarousel = document.querySelector(
			'.slider-frame.brand_experience_carousel'
		);

		setTimeout(() => {
			setScreenWidth(
				(targetCarousel as HTMLElement).getBoundingClientRect().width
			);
		}, 300);
	};

	useEffect(() => {
		/* 최초 화면 렌더링시에만 사용 */
		screenWidthHandler();
	}, [brandExperienceCarousel]);

	useEffect(() => {
		getNoticeList();

		window.addEventListener('resize', screenWidthHandler);
		return () => {
			window.removeEventListener('resize', screenWidthHandler);
		};
	}, []);

	return (
		noticeList?.length > 0 && (
			<>
				<DashboardSection sx={{marginTop: '20px'}}>
					<SectionBox
						sx={{
							minWidth: '590px',
							maxWidth: '590px',
							minHeight: '240px',
							maxHeight: '240px',
						}}>
						<SectionTitleComponent
							boxTitle={
								<Stack
									alignItems={'center'}
									flexDirection="row"
									sx={{
										display: 'inline-flex',
										cursor: 'pointer',
									}}
									onClick={() => {
										goToNoticeList();
										sendAmplitudeLog(
											'dashboard_noticeerrow_click',
											{
												button_title:
													'공지사항 전체리스트로 이동',
											}
										);
									}}>
									<Typography
										variant="h3"
										sx={{
											fontWeight: 700,
											fontSize: '18px',
											lineHeight: '145%',
											color: 'grey.900',
										}}>
										공지사항
									</Typography>

									<IcChevronRight width="17" height="24" />
								</Stack>
							}
						/>
						<Stack gap="12px">
							{noticeList &&
								noticeList?.map(
									(li, idx) =>
										idx < 5 && (
											<Stack
												key={`dashboard-notice-list-${li.id}`}
												flexDirection={'row'}
												alignItems="center"
												justifyContent={'space-between'}
												gap="12px">
												<Stack
													flexDirection={'row'}
													alignItems="center">
													<Typography
														variant="h4"
														sx={{
															display:
																'inline-block',
															marginRight: '4px',
															fontWeight: 500,
															fontSize: '13px',
															lineHeight: '145%',
															color: 'grey.900',
															cursor: 'pointer',
														}}
														onClick={() => {
															openNotice(
																noticeList.length -
																	idx
															);
														}}>
														{li.Name}
													</Typography>

													{isNewNotice(
														getNotionDate(li)
													) && <IcNewInRedCircle />}
												</Stack>

												<Typography
													variant="h6"
													sx={{
														display: 'inline-block',
														fontWeight: 500,
														fontSize: '13px',
														lineHeight: '145%',
														minWidth: '80px',
														textAlign: 'right',
														color: 'grey.400',
													}}>
													{getNotionDate(li)}
													{/* {li?.Date} */}
												</Typography>
											</Stack>
										)
								)}
						</Stack>
					</SectionBox>

					<Stack flexDirection={'row'} gap="20px">
						<SectionBox
							sx={{
								minWidth: '285px',
								maxWidth: '285px',
								minHeight: '240px',
								maxHeight: '240px',
								padding: 0,
							}}>
							<Stack>
								<Carousel
									slidesToShow={1}
									autoplay
									autoplayInterval={2000}
									wrapAround={true}
									defaultControlsConfig={{
										containerClassName:
											'service-slide-dots-box',
										pagingDotsContainerClassName:
											'slider-paging-box',
										nextButtonStyle: {
											fontSize: 0,
											transform: 'rotate(180deg)',
											minWidth: '20px',
											minHeight: '20px',
											maxWidth: '20px',
											maxHeight: '20px',
											boxShadow:
												'0px 0px 5px rgba(0, 0, 0, 0.1)',
											backgroundImage: `url(${IcCarouselArrow}) !important`,
											backgroundSize: 'contain',
											backgroundRepeat: 'no-repeat',
											backdropFilter: 'blur(10px)',
											borderRadius: '50%',

											position: 'absolute',
											right: '8px',
											top: 0,
											bottom: 0,
											margin: 'auto 0',
											zIndex: 5,
											cursor: 'pointer',
										},
										prevButtonStyle: {
											fontSize: 0,
											minWidth: '20px',
											minHeight: '20px',
											maxWidth: '20px',

											boxShadow:
												'0px 0px 5px rgba(0, 0, 0, 0.1)',
											maxHeight: '20px',
											backgroundImage: `url(${IcCarouselArrow}) !important`,
											backgroundSize: 'contain',
											backgroundRepeat: 'no-repeat',
											backdropFilter: 'blur(10px)',
											borderRadius: '50%',

											position: 'absolute',
											left: '8px',
											top: 0,
											bottom: 0,
											margin: 'auto 0',
											zIndex: 5,
											cursor: 'pointer',
										},
									}}
									// scrollMode={'page' | 'remainder'}
								>
									{serviceTipList.map(
										(
											{
												title,
												img,
												link,
												taxoInfo: {
													eventName,
													eventProperty,
												},
											},
											idx
										) => (
											<Stack
												key={`vircle-service-tip-box-${idx}`}
												sx={{
													cursor: 'pointer',
													width: '100%',
													heigth: '100%',
													paddingTop: '24px',
												}}
												onClick={() => {
													sendAmplitudeLog(
														eventName,
														{
															button_title:
																eventProperty,
														}
													);
													navigate(link);
												}}>
												<Typography
													variant="h3"
													sx={{
														fontWeight: 500,
														fontSize: '15px',
														lineHeight: '145%',
														color: 'primary.main',
														padding: '0 24px',
													}}>
													서비스 활용 Tip
												</Typography>
												<Typography
													variant="h3"
													sx={{
														fontWeight: 700,
														fontSize: '18px',
														lineHeight: '145%',
														color: 'grey.900',
														marginBottom: '21px',
														padding: '0 24px',
													}}>
													{title}
												</Typography>

												<Stack
													sx={{
														img: {
															width: '170px',
															height: '120px',
															marginLeft: 'auto',
															marginBottom: '1px',
														},
													}}>
													<img
														src={img}
														alt="service-tip"
													/>
												</Stack>
											</Stack>
										)
									)}
								</Carousel>
							</Stack>
						</SectionBox>

						<Box
							sx={{
								minWidth: '285px',
								maxWidth: '285px',
								minHeight: '240px',
								maxHeight: '240px',
								padding: 0,
							}}></Box>
					</Stack>
				</DashboardSection>

				<Box
					sx={{
						maxWidth: '1201px',
						width: '100%',
						margin: '0 auto',
					}}>
					<Carousel
						// slidesToShow={
						// 	screenWidth > 0
						// 		? screenWidth / 387
						// 		: window.innerWidth / 387
						// }
						// slidesToShow={Math.round(screenWidth / 387)}
						// slidesToShow={Math.round(screenWidth / 400)}
						// slidesToShow={3}
						// slidesToShow={
						// 	(
						// 		brandExperienceCarousel as HTMLElement
						// 	)?.getBoundingClientRect()?.width / 407
						// }
						// className={`brand_experience_carousel ${
						// 	(
						// 		brandExperienceCarousel as HTMLElement
						// 	)?.getBoundingClientRect()?.width / 407
						// }`}
						slidesToShow={screenWidth / 407}
						className="brand_experience_carousel"
						defaultControlsConfig={{
							containerClassName: 'brand-story-slider-paging-box',
							pagingDotsContainerClassName:
								'brand-story-slider-paging-box',
							nextButtonStyle: {
								fontSize: 0,
								transform: 'rotate(180deg)',
								minWidth: '40px',
								minHeight: '40px',
								maxWidth: '40px',
								maxHeight: '40px',
								backgroundSize: 'contain',
								backgroundRepeat: 'no-repeat',
								backdropFilter: 'blur(10px)',
								borderRadius: '50%',

								position: 'absolute',
								// right: '-34px',
								top: 0,
								bottom: 0,
								margin: 'auto 0',
								zIndex: 5,
								cursor: 'pointer',
							},
							prevButtonStyle: {
								fontSize: 0,
								minWidth: '40px',
								minHeight: '40px',
								maxWidth: '40px',
								maxHeight: '40px',
								backgroundSize: 'contain',
								backgroundRepeat: 'no-repeat',
								backdropFilter: 'blur(10px)',
								borderRadius: '50%',

								position: 'absolute',
								// left: '-34px',
								top: 0,
								bottom: 0,
								margin: 'auto 0',
								zIndex: 5,
								cursor: 'pointer',
							},
						}}>
						{brandExperienceList.map(
							(
								{
									title,
									subtitle,
									img,
									link,
									taxoInfo: {eventName, eventProperty},
								},
								idx
							) => (
								<SectionBox
									key={`brand-experience-box-${idx}`}
									sx={{
										minWidth: '387px',
										maxWidth: '387px',
										minHeight: '430px',
										maxHeight: '430px',
										width: '100%',
										height: '100%',
										// marginRight: '20px',
										boxShadow: 'none',
									}}>
									<Stack
										// justifyContent={'space-between'}
										sx={{height: '100%'}}>
										<Stack>
											<Typography
												variant="h3"
												sx={{
													fontWeight: 700,
													fontSize: '18px',
													lineHeight: '145%',
													color: 'primary.main',
													marginBottom: '4px',
												}}>
												브랜드 경험
											</Typography>
											<Typography
												variant="h3"
												sx={{
													fontWeight: 700,
													fontSize: '24px',
													lineHeight: '145%',
													color: 'grey.900',
													marginBottom: '6px',
												}}>
												{title}
											</Typography>
											<Typography
												variant="h3"
												sx={{
													fontWeight: 500,
													fontSize: '15px',
													lineHeight: '145%',
													color: 'grey.600',
													marginBottom: '8px',
												}}>
												{subtitle}
											</Typography>
											<AtagComponent url={link}>
												<Typography
													onClick={() => {
														sendAmplitudeLog(
															eventName,
															{
																button_title:
																	eventProperty,
															}
														);
													}}
													variant="h3"
													sx={{
														fontWeight: 500,
														fontSize: '15px',
														lineHeight: '145%',
														cursor: 'pointer',
														color: 'primary.main',
														// marginBottom: '39px',
														display: 'inline-block',
													}}>
													자세히 보기
												</Typography>
											</AtagComponent>
										</Stack>

										<Stack
											sx={{
												height: '100%',
												marginTop: 'auto',
												img: {
													width: '339px',
													height: '190px',
													borderRadius: '8px',
													marginTop: 'auto',
												},
											}}>
											<img
												src={img}
												alt="brand-stroy-img"
											/>
										</Stack>
									</Stack>
								</SectionBox>
							)
						)}
					</Carousel>
				</Box>

				<DashboardSection>
					{/* {brandExperienceList.map(
						({title, subtitle, url, img, link}, idx) => (
							<SectionBox
								sx={{
									minWidth: '387px',
									minHeight: '430px',
									maxHeight: '430px',
								}}>
								<Stack>
									<Typography
										variant="h3"
										sx={{
											fontWeight: 700,
											fontSize: '18px',
											lineHeight: '145%',
											color: 'primary.main',
											marginBottom: '4px',
										}}>
										브랜드 경험
									</Typography>
									<Typography
										variant="h3"
										sx={{
											fontWeight: 700,
											fontSize: '24px',
											lineHeight: '145%',
											color: 'grey.900',
											marginBottom: '6px',
										}}>
										{title}
									</Typography>
									<Typography
										variant="h3"
										sx={{
											fontWeight: 500,
											fontSize: '15px',
											lineHeight: '145%',
											color: 'grey.600',
											marginBottom: '8px',
										}}>
										{subtitle}
									</Typography>
									<Typography
										variant="h3"
										sx={{
											fontWeight: 500,
											fontSize: '15px',
											lineHeight: '145%',
											cursor: 'pointer',
											color: 'primary.main',
											marginBottom: '39px',
										}}>
										자세히 보기
									</Typography>
								</Stack>
							</SectionBox>
						)
					)} */}

					{/* <Stack sx={{maxWidth: '1200px', backgroundColor: 'blue'}}>
						<Carousel
							slidesToShow={3}
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
							{brandExperienceList.map(
								({title, subtitle, url, img, link}, idx) => (
									<SectionBox
										sx={{
											minWidth: '387px',
											minHeight: '430px',
											maxHeight: '430px',
										}}>
										<Stack>
											<Typography
												variant="h3"
												sx={{
													fontWeight: 700,
													fontSize: '18px',
													lineHeight: '145%',
													color: 'primary.main',
													marginBottom: '4px',
												}}>
												브랜드 경험
											</Typography>
											<Typography
												variant="h3"
												sx={{
													fontWeight: 700,
													fontSize: '24px',
													lineHeight: '145%',
													color: 'grey.900',
													marginBottom: '6px',
												}}>
												{title}
											</Typography>
											<Typography
												variant="h3"
												sx={{
													fontWeight: 500,
													fontSize: '15px',
													lineHeight: '145%',
													color: 'grey.600',
													marginBottom: '8px',
												}}>
												{subtitle}
											</Typography>
											<Typography
												variant="h3"
												sx={{
													fontWeight: 500,
													fontSize: '15px',
													lineHeight: '145%',
													cursor: 'pointer',
													color: 'primary.main',
													marginBottom: '39px',
												}}>
												자세히 보기
											</Typography>
										</Stack>
									</SectionBox>
								)
							)}
						</Carousel>
					</Stack> */}
				</DashboardSection>
			</>
		)
	);
}

export default DashboardInfoCentreSection;
