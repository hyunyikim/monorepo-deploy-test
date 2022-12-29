import {useMemo} from 'react';
import {makeStyles} from '@mui/styles';
import classNames from 'classnames';
import {useLocation} from 'react-router-dom';
import {parse, stringify} from 'qs';
import {useAsync} from 'react-use';

import {Grid, Theme} from '@mui/material';

import {useLoginStore} from '@/stores';
import {isConfirmedInterwork} from '@/api/cafe24.api';
import {usePageView, goToParentUrl} from '@/utils';

import cafe24WhiteLogo from '@/assets/images/cafe24/img_cafe24_logo.png';
import cafe24WhiteLogo2x from '@/assets/images/cafe24/img_cafe24_logo@2x.png';
import cafe24BlackLogo from '@/assets/images/cafe24/img_cafe24_black_logo.png';
import cafe24BlackLogo2x from '@/assets/images/cafe24/img_cafe24_black_logo@2x.png';

import banner1 from '@/assets/images/cafe24/img_cafe24_nft_first_banner.png';
import banner1_2x from '@/assets/images/cafe24/img_cafe24_nft_first_banner@2x.png';
import banner2 from '@/assets/images/cafe24/img_cafe24_nft_second_banner.png';
import banner2_2x from '@/assets/images/cafe24/img_cafe24_nft_second_banner@2x.png';
import banner3 from '@/assets/images/cafe24/img_cafe24_nft_third_banner.png';
import banner3_2x from '@/assets/images/cafe24/img_cafe24_nft_third_banner@2x.png';

import phone from '@/assets/images/cafe24/img_cafe24_phone.png';
import phone2x from '@/assets/images/cafe24/img_cafe24_phone@2x.png';

import {LogoVircleText, LogoVircleText2x} from '@/assets/images';

import blueArrow from '@/assets/images/cafe24/img_cafe24_blue_arrow.png';
import blueArrow2x from '@/assets/images/cafe24/img_cafe24_blue_arrow@2x.png';

import blueBallon from '@/assets/images/cafe24/img_cafe24_blue_benfit_ballon.png';
import blueBallon2x from '@/assets/images/cafe24/img_cafe24_blue_benfit_ballon@2x.png';

import kakaoAlramTalk from '@/assets/images/cafe24/img_cafe24_kakao_alram_talk.png';
import kakaoAlramTalk2x from '@/assets/images/cafe24/img_cafe24_kakao_alram_talk@2x.png';

import twistedArrow from '@/assets/images/cafe24/img_cafe24_twisted_arrow.png';
import twistedArrow2x from '@/assets/images/cafe24/img_cafe24_twisted_arrow@2x.png';

import iconLink from '@/assets/images/cafe24/icon_cafe24_link.png';
import iconLink2x from '@/assets/images/cafe24/icon_cafe24_link@2x.png';
import iconTruck from '@/assets/images/cafe24/icon_cafe24_delivery_truck.png';
import iconTruck2x from '@/assets/images/cafe24/icon_cafe24_delivery_truck@2x.png';
import iconDoc from '@/assets/images/cafe24/icon_cafe24_doc.png';
import iconDoc2x from '@/assets/images/cafe24/icon_cafe24_doc@2x.png';
import iconBell from '@/assets/images/cafe24/icon_cafe24_noticheck.png';
import iconBell2x from '@/assets/images/cafe24/icon_cafe24_noticheck@2x.png';

const cafe24Scope = CAFE24_SCOPE;

// TODO: makeStyles -> tss-react로 변경하기
const useStyles = makeStyles((theme: Theme) => ({
	sectionContainer: {
		position: 'relative',
		width: '100%',
		'&.overview': {
			height: '660px',
			background:
				'linear-gradient(107.29deg, #2D364F 11.9%, #000000 100%)',
			padding: '100px 0 89px',
		},
		'&.issue': {
			padding: '200px 0',
		},
		'&.nft': {
			padding: '300px 0 200px',
		},
		'&.vircle': {
			padding: '120px 0 0',
			marginBottom: '200px',
			background: theme.palette.grey[50],
		},
		'&.last': {
			// padding : '120px 0 0',
			// marginBottom :'200px',
		},
	},
	inner: {
		maxWidth: '1160px',
		margin: 'auto',
	},
	// overview(first)
	logo: {
		marginBottom: '32px',
	},
	sectionTitle: {
		fontSize: '44px',
		fontWeight: 700,
		color: 'black',
		textAlign: 'left',
		margin: 0,
		marginBottom: '24px',
		lineHeight: '60px',

		'&.white': {
			color: 'white',
			fontSize: '40px',
		},
		'&.center': {
			textAlign: 'center',
		},
		'&.noMagin': {
			margin: 0,
			lineHeight: '50px',
		},
	},
	subTitle: {
		fontWeight: '400',
		fontSize: '20px',
		lineHeight: '32px',
		textAlign: 'left',
		color: theme.palette.grey[600],
		margin: 0,

		'&.white': {
			color: 'rgba(255, 255, 255, 0.6)',
		},

		'&.center': {
			textAlign: 'center',
		},

		'&.onTop': {
			fontSize: '24px',
			marginBottom: '24px',
		},

		'&.b8': {
			fontSize: '24px',
			marginBottom: '8px',
		},

		'& strong': {
			fontWeight: 700,
		},
	},
	blueBtn: {
		padding: '12px 16px',
		height: '44px',
		width: '180px',
		fontWeight: 700,
		fontSize: '14px',
		lineHeight: '20px',
		textAlign: 'center',
		color: 'white',
		background: theme.palette.primary.main,
		borderRadius: '8px',
		border: 0,
		marginTop: '40px',
		cursor: 'pointer',
	},
	bigBlueBtn: {
		padding: '12px 16px',
		height: '44px',
		width: '240px',
		fontWeight: 700,
		fontSize: '14px',
		lineHeight: '20px',
		textAlign: 'center',
		color: 'white',
		background: theme.palette.primary.main,
		borderRadius: '8px',
		border: 0,
		marginTop: '50px',
		cursor: 'pointer',
	},
	stepNum: {
		fontWeight: 700,
		fontSize: '20px',
		lineHeight: '32px',
		textAlign: 'center',
		color: theme.palette.primary.main,
		position: 'relative',
		margin: 0,
	},
	stepTxt: {
		color: 'white',
		fontWeight: 700,
		fontSize: '16px',
		lineHeight: '32px',
		textAlign: 'center',
		margin: 0,
	},
	whiteLine: {
		display: 'block',
		width: '139px',
		height: '1px',
		background: '#E2E2E2',
		position: 'absolute',
		top: '16px',
		right: '-127px',
		'&.second': {
			right: '-105px',
		},
	},
	// (second)
	circleBox: {
		'& .blueCircle': {
			'&:after': {
				content: '""',
				display: 'block',

				position: 'absolute',
				zIndex: '-1',
				top: '-4px',
				right: '-4px',
				borderRadius: '50%',
				height: 'calc(100% + 8px)',
				width: 'calc(100% + 8px)',
				maxWidth: '211px',
				maxHeight: '211px',
				background: 'linear-gradient(to right, #5e9afa 50%, #715bf9)',
			},
		},
	},
	circle: {
		display: 'flex',
		flexDirection: 'column',
		gap: '8px',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.palette.grey[50],
		border: `1px solid linear-gradient(to right, #5f9bfb, #705ffa)`,
		borderRadius: '50%',
		maxWidth: '211px',
		position: 'relative',
		height: '100%',
	},
	blueCircle: {
		display: 'flex',
		flexDirection: 'column',
		gap: '8px',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: '50%',
		height: '100%',
		marginLeft: '4px',
		maxWidth: '202px',
		maxHeight: '202px',
		position: 'relative',
		backgroundColor: theme.palette.primary[50],
	},

	txtInCircle: {
		color: theme.palette.primary.main,
		fontWeight: 700,
		fontSize: '21px',
		lineHeight: '25px',
		textAlign: 'center',
		margin: 0,
	},
	blueArrow: {
		position: 'absolute',
		zIndex: '-1',
		right: '-105px',
		top: 'calc(50% - 1px)',
		// right : '16px',
		// top : 'calc(50% - 1px)',
	},
	iconInCircle: {
		width: '25px',
		height: '25px',
	},
	blueBallon: {
		position: 'absolute',
		left: '100px',
		top: '-32px',
		zIndex: 3,
	},
	kakaoAlram: {
		position: 'absolute',
		left: '-142px',
		bottom: '-372px',
		zIndex: 3,
		boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
		borderRadius: '12px',
	},
	twistedArrow: {
		position: 'absolute',
		left: '0px',
		bottom: '-30px',
		zIndex: 3,
	},
	// (third)
	banner: {
		marginTop: '56px',
	},
	smallBanner: {
		margin: '0px',
	},
	// (fourth)
	phoneImg: {},
	// (fifth)
	connectBox: {
		maxWidth: '1140px',
		margin: 'auto',
		background: 'linear-gradient(180deg, #2B2B4F 0%, #515186 100%)',
		borderRadius: '16px',
		padding: '90px 0',
		marginBottom: '150px',
	},
	partnersBox: {
		width: '100%',
		height: '250px',
		background: theme.palette.primary[50],
		padding: '88px 0',
		textAlign: 'center',
	},
	partnersTxt: {
		color: '#686F95',
		fontSize: '24px',
		lineHeight: '24px',
		margin: 0,
		marginTop: '9px',
	},
}));

function Cafe24Init() {
	usePageView('cafe24_service_pv', 'cafe24 연동 소개 화면');

	const classes = useStyles();
	const {search} = useLocation();
	const isLogin = useLoginStore((state) => state.isLogin)();

	const mallId = useMemo<string | null>(() => {
		const parsed = parse(search, {
			ignoreQueryPrefix: true,
		});
		return (parsed?.mall_id || null) as string | null;
	}, [search]);

	const {value: isConfirmed, loading} = useAsync(async () => {
		if (!mallId) return;

		// cafe24에서 확인된 mall이고 로그인이 된 사용자라면 인터워크 페이지로 넘김
		const result = await isConfirmedInterwork(mallId);
		if (result && isLogin) {
			goToParentUrl('/b2b/interwork/cafe24');
		}
		return result;
	}, [mallId, isLogin]);

	// cafe24 api 사용권한 동의 및 앱 설치 페이지
	const requestAuthCode = () => {
		if (!mallId) return;

		const queryParams = {
			response_type: 'code',
			client_id: CAFE24_CLIENT_ID,
			state: window.btoa(mallId),
			scope: cafe24Scope,
			redirect_uri: CAFE24_REDIRECT_URL,
		};
		const query = stringify(queryParams);
		window.location.href = `https://${mallId}.cafe24api.com/api/v2/oauth/authorize?${query}`;
	};

	const moveSignUpPage = () => {
		if (!mallId) {
			window.alert('올바른 접근이 아닙니다.');
			goToParentUrl('/');
			return;
		}
		if (isConfirmed) {
			goToParentUrl('/');
			return;
		}

		// TODO: 로그인 안 되었는데 접근하는 경우 확인

		// mallId 존재하는데, 아직 설치 되지 않았다면 authcode 요청
		requestAuthCode();
	};

	if (loading) {
		return <div></div>;
	}

	return (
		<Grid
			container
			direction={'column'}
			minWidth={1160}
			alignItems={'center'}
			justifyContent={'center'}
			sx={{
				position: 'absolute',
				top: 0,
				left: 0,
			}}>
			{/* first */}
			<Grid
				container
				className={classNames(classes.sectionContainer, 'overview')}>
				<Grid
					container
					className={classes.inner}
					wrap="nowrap"
					direction={'column'}
					alignItems={'center'}
					justifyContent={'center'}>
					<img
						src={cafe24WhiteLogo}
						srcSet={`${cafe24WhiteLogo2x} 2x`}
						className={classNames(classes.logo)}
						alt="cafe24-logo"
					/>
					<h1
						className={classNames(
							classes.sectionTitle,
							'white',
							'center'
						)}>
						주문 연동으로 편하게
						<br />
						디지털 개런티 자동 발급 서비스
					</h1>

					<p
						className={classNames(
							classes.subTitle,
							'white',
							'center'
						)}>
						버클을 통해 <br />
						디지털 개런티를 자동으로 발급해 보세요
					</p>

					<Grid
						container
						justifyContent={'center'}
						alignItems={'center'}
						width={'504px'}
						gap="93px"
						marginTop={'53px'}>
						<Grid item position={'relative'}>
							<h2 className={classes.stepNum}>1</h2>
							<h2 className={classes.stepTxt}>회원가입</h2>
							<div className={classes.whiteLine} />
						</Grid>
						<Grid item position={'relative'}>
							<h2 className={classes.stepNum}>2</h2>
							<h2 className={classes.stepTxt}>
								개런티 내용 설정
							</h2>
							<div
								className={classNames(
									classes.whiteLine,
									'second'
								)}
							/>
						</Grid>
						<Grid item position={'relative'}>
							<h2 className={classes.stepNum}>3</h2>
							<h2 className={classes.stepTxt}>주문연동</h2>
						</Grid>
					</Grid>

					<button
						data-tracking={`cafe24_service_start_click,{'pv_title': '연동 시작하기'}`}
						onClick={moveSignUpPage}
						className={classes.bigBlueBtn}>
						연동 시작하기
					</button>
				</Grid>
			</Grid>
			{/* second */}
			<Grid
				container
				className={classNames(classes.sectionContainer, 'issue')}>
				<Grid
					container
					className={classes.inner}
					wrap="nowrap"
					direction={'column'}
					alignItems={'center'}
					justifyContent={'center'}>
					<img
						src={cafe24BlackLogo}
						srcSet={`${cafe24BlackLogo2x} 2x`}
						className={classNames(classes.logo)}
						alt="cafe24-logo"
					/>
					<h1 className={classNames(classes.sectionTitle, 'center')}>
						카페24 쇼핑몰 연동으로
						<br />
						NFT 개런티를 자동 발급해요!
					</h1>

					<p className={classNames(classes.subTitle, 'center')}>
						카페24 쇼핑몰 1회 연동으로
						<br />
						배송완료와 동시에 <strong>
							NFT 디지털 개런티가
						</strong>{' '}
						고객에게 발송됩니다.
						<br />
						고객은 클릭 한 번으로 개런티를 확인할 수 있습니다.
					</p>

					<Grid
						container
						gap={'105px'}
						alignItems={'center'}
						wrap="nowrap"
						marginTop={'146px'}
						height={'211px'}
						className={classNames(classes.circleBox, 'circleBox')}>
						<Grid item flexBasis={'23%'} className={classes.circle}>
							<img
								src={iconLink}
								srcSet={`${iconLink2x} 2x`}
								className={classNames(classes.iconInCircle)}
								alt="cafe24-logo"
							/>
							<h4 className={classes.txtInCircle}>버클 연동</h4>
							<img
								src={blueArrow}
								srcSet={`${blueArrow2x} 2x`}
								className={classNames(classes.blueArrow)}
								alt="cafe24-logo"
							/>
						</Grid>
						<Grid item flexBasis={'23%'} className={classes.circle}>
							<img
								src={iconTruck}
								srcSet={`${iconTruck2x} 2x`}
								className={classNames(classes.iconInCircle)}
								alt="cafe24-logo"
							/>
							<h4 className={classes.txtInCircle}>
								주문 배송완료
							</h4>
							<img
								src={blueArrow}
								srcSet={`${blueArrow2x} 2x`}
								className={classNames(classes.blueArrow)}
								alt="cafe24-logo"
							/>
						</Grid>
						<Grid
							item
							flexBasis={'23%'}
							className={classNames(
								classes.blueCircle,
								'blueCircle'
							)}>
							<img
								src={iconDoc}
								srcSet={`${iconDoc2x} 2x`}
								className={classNames(classes.iconInCircle)}
								alt="cafe24-logo"
							/>
							<img
								src={blueBallon}
								srcSet={`${blueBallon2x} 2x`}
								className={classNames(classes.blueBallon)}
								alt="cafe24-logo"
							/>
							<h4 className={classes.txtInCircle}>
								개런티 자동 발급
							</h4>
							<img
								src={blueArrow}
								srcSet={`${blueArrow2x} 2x`}
								className={classNames(classes.blueArrow)}
								alt="cafe24-logo"
							/>
						</Grid>
						<Grid item flexBasis={'23%'} className={classes.circle}>
							<img
								src={kakaoAlramTalk}
								srcSet={`${kakaoAlramTalk2x} 2x`}
								className={classNames(classes.kakaoAlram)}
								alt="cafe24-logo"
							/>
							<img
								src={twistedArrow}
								srcSet={`${twistedArrow2x} 2x`}
								className={classNames(classes.twistedArrow)}
								alt="cafe24-logo"
							/>
							<img
								src={iconBell}
								srcSet={`${iconBell2x} 2x`}
								className={classNames(classes.iconInCircle)}
								alt="cafe24-logo"
							/>
							<h4 className={classes.txtInCircle}>
								고객에게 <br />
								알림톡 발송
							</h4>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			{/* third */}
			<Grid
				container
				className={classNames(classes.sectionContainer, 'nft')}>
				<Grid
					container
					className={classes.inner}
					wrap="nowrap"
					direction={'column'}
					alignItems={'flex-start'}
					justifyContent={'center'}>
					<p className={classNames(classes.subTitle, 'onTop')}>
						간편한 개런티 발급
					</p>
					<h1 className={classNames(classes.sectionTitle)}>
						브랜드에 NFT를 더하다
						<br />
						디지털 개런티의 매력
					</h1>

					<img
						src={banner1}
						srcSet={`${banner1_2x} 2x`}
						className={classNames(classes.banner)}
						alt="cafe24-logo"
					/>
					<Grid container gap={'40px'} marginTop={'40px'}>
						<img
							src={banner2}
							srcSet={`${banner2_2x} 2x`}
							className={classNames(classes.smallBanner)}
							alt="cafe24-logo"
						/>
						<img
							src={banner3}
							srcSet={`${banner3_2x} 2x`}
							className={classNames(classes.smallBanner)}
							alt="cafe24-logo"
						/>
					</Grid>
				</Grid>
			</Grid>
			{/* fourth */}
			<Grid
				container
				className={classNames(classes.sectionContainer, 'vircle')}>
				<Grid
					container
					className={classes.inner}
					wrap="nowrap"
					direction={'row'}
					alignItems={'flex-end'}
					justifyContent={'space-between'}>
					<Grid
						container
						// className={classes.inner}
						wrap="nowrap"
						direction={'column'}
						margin={'0 auto 200px'}
						alignItems={'flex-start'}
						justifyContent={'center'}>
						<p className={classNames(classes.subTitle, 'onTop')}>
							새로운 디지털 지갑
						</p>
						<h1 className={classNames(classes.sectionTitle)}>
							고객은 모든 개런티
							<br />
							관리를 편하게
						</h1>
						<p className={classNames(classes.subTitle, 'b8')}>
							잃어버릴 걱정 없는 디지털 개런티 관리 <br />
							구매 이력과 AS 신청까지 한곳에서 관리해요
						</p>

						{/* <a href={'https://app.vircle.co.kr'} target="_blank" rel="noreferrer">
							<button className={classes.blueBtn}>버클 앱 자세히 보기</button>
						</a> */}
					</Grid>

					<img
						src={phone}
						srcSet={`${phone2x} 2x`}
						className={classNames(classes.phoneImg)}
						alt="cafe24-logo"
					/>
				</Grid>
			</Grid>
			{/* fifth */}
			<Grid
				container
				direction={'column'}
				className={classNames(classes.sectionContainer, 'last')}>
				<Grid
					container
					className={classes.connectBox}
					wrap="nowrap"
					direction={'column'}
					alignItems={'center'}
					justifyContent={'space-between'}>
					<h1
						className={classNames(
							classes.sectionTitle,
							'white',
							'center',
							'noMagin'
						)}>
						한번의 연동으로 <br />
						편해지는 개런티 발급!
					</h1>

					<button
						data-tracking={`cafe24_service_startbottom_click,{'pv_title': '연동 시작하기(하단)'}`}
						onClick={moveSignUpPage}
						className={classes.blueBtn}>
						연동 시작하기
					</button>
				</Grid>

				<div className={classes.partnersBox}>
					<img
						src={LogoVircleText}
						srcSet={`${LogoVircleText2x} 2x`}
						className={classNames(classes.phoneImg)}
						alt="cafe24-logo"
					/>
					<p className={classes.partnersTxt}>브랜드에 NFT를 더하다</p>
				</div>
			</Grid>
		</Grid>
	);
}

export default Cafe24Init;
