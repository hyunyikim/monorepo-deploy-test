import {useMemo, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {parse, ParsedQs, stringify} from 'qs';
import {useAsyncFn, useAsync} from 'react-use';

import {
	Card,
	Avatar,
	Divider,
	Grid,
	Stack,
	Typography,
	CircularProgress,
} from '@mui/material';

import {useLoginStore, useGetPartnershipInfo} from '@/stores';
import {goToParentUrl, goToParentUrlWithState, usePageView} from '@/utils';
import {confirmInterwork, requestInterwork} from '@/api/cafe24.api';

import {Button} from '@/components';
import cafe24Logo from '@/assets/images/cafe24/cafe24_logo.png';
import cafe24Logo2x from '@/assets/images/cafe24/cafe24_logo@2x.png';
import cafe24AvatarLogo from '@/assets/images/cafe24/cafe24_avatar.png';
import {Cafe24Interwork} from '@/@types';

const title = '카페24';
const subtitle = '연동완료';
const issueTiming = '배송완료';
const targetProduct = '전체상품';
const gridStyle = {
	margin: '10px 0px 10px 0px',
};

/**
 *
 * 해당 페이지로 유입되는 경로가 다양해 복잡도가 높아져있음.
 *
 * 유입 경로
 * 1) cafe24 앱 설치 완료 이후(파라미터 mallId, code)
 * 2) cafe24 설치 후 로그인/회원가입을 완료한 이후
 * 3) cafe24 설치 후 개런티 설정을 완료한 이후
 */
export default function Cafe24InterWork() {
	usePageView('cafe24_linkorder_pv', '주문내역 연동화면');

	const isLogin = useLoginStore((state) => state.isLogin)();
	const {data: partnershipData, isLoading: isPartnershipDataLoading} =
		useGetPartnershipInfo();

	const [confirmed, setConfirmed] = useState(false);
	const {search} = useLocation();

	const parsed = useMemo(() => {
		return parse(search, {
			ignoreQueryPrefix: true,
		});
	}, [search]);

	const mallId = useMemo<string | null>(() => {
		if (parsed?.state && window?.atob) {
			return window.atob(parsed?.state as string);
		}
		return null;
	}, [parsed]);

	// 연동 초기 요청
	const {value, loading} = useAsync(async () => {
		if (!mallId || isPartnershipDataLoading) return;

		const result = await requestInterwork(mallId, parsed.code as string);
		if (!isLogin) {
			moveToSignUpPage(result, parsed);
			return;
		}

		// 아직 개런티 설정 하기 전일 경우,
		if (!partnershipData?.profileImage) {
			if (parsed.isFirstTime !== 'Y') {
				goToSetUpPage(result, parsed);
			}
		}
		return result;
	}, [mallId, parsed, partnershipData, isPartnershipDataLoading]);

	// 버튼 클릭시, 연동 확인
	const [{loading: confirmLoading}, confirm] = useAsyncFn(async () => {
		if (!mallId) return;

		await new Promise((resolve) => setTimeout(resolve, 1500));

		await confirmInterwork(mallId);
		setConfirmed(true);
		await new Promise((resolve) => setTimeout(resolve, 500));
		moveToServiceInterworkPage();
	}, [mallId]);

	const moveNext = async () => {
		if (isLogin) {
			await confirm();
		}
	};

	const moveToSignUpPage = (interwork: Cafe24Interwork, parsed: ParsedQs) => {
		const store = {
			context: 'cafe24',
			email: interwork.store.email,
			companyName: interwork.store.company_name,
			presidentName: interwork.store.president_name,
			registrationNo: interwork.store.company_registration_no,
			phone: interwork.store.phone,
			code: parsed.code,
			state: parsed.state,
		};
		const query = stringify(store);
		goToParentUrl(`/auth/signup?${query}`);
	};

	const goToSetUpPage = (interwork: Cafe24Interwork, parsed: ParsedQs) => {
		const query = {
			context: 'cafe24',
			code: parsed.code,
			state: parsed.state,
		};
		if (query.code && query.state) {
			const cafe24Query = stringify(query);
			goToParentUrl(`/setup/dynamic?${cafe24Query}`);
		}
	};

	// cafe24 연동 완료 상태와 함께 서비스 연동 페이지로 이동
	const moveToServiceInterworkPage = () => {
		goToParentUrlWithState(`/b2b/interwork`, {connectCafe24: true});
	};

	if (loading || !value) {
		return (
			<Stack
				direction="column"
				justifyContent="center"
				alignItems="center"
				spacing={2}
				height="100vh"></Stack>
		);
	}

	return (
		<Stack
			direction="column"
			justifyContent="center"
			alignItems="center"
			spacing={2}
			height="100vh">
			<Stack
				direction="column"
				alignItems="center"
				justifyContent="center"
				sx={{
					'& h2': {
						fontSize: 24,
						lineHeight: '32px',
						fontWeight: 'bold',
					},
					'& h3': {
						fontSize: 20,
						fontWeight: 'bold',
					},
				}}>
				<img
					src={cafe24Logo}
					srcSet={`${cafe24Logo} 1x, ${cafe24Logo2x} 2x`}
				/>
				<Typography
					variant="h2"
					textAlign="center"
					color="#000"
					mt="24px">
					카페24를 연동하면, 개런티를 자동 발급할 수 있어요!
				</Typography>
				<Typography
					color="#7B7B86"
					fontSize={16}
					fontWeight="500"
					textAlign="center"
					mt="16px"
					mb="40px">
					{partnershipData?.brand?.name} 쇼핑몰에서 판매한 모든 상품이
					배송완료되면 디지털 개런티가 자동으로 발급됩니다.
				</Typography>
				<Card
					sx={{
						p: 3,
						width: 500,
						mb: '24px',
						border: '1px solid',
						borderColor: confirmed ? '#00C29F' : '#E2E2E9',
						boxShadow: 'none',
					}}>
					<Stack spacing={2}>
						<Stack
							alignItems="center"
							direction="row"
							spacing={3}
							mb="4px">
							<Avatar
								sx={{
									width: 56,
									height: 56,
									border: 'solid 1px #e2e2e9',
								}}
								variant="rounded"
								src={cafe24AvatarLogo}
							/>
							<Stack spacing={0.5}>
								<Stack
									direction="row"
									alignItems="center"
									spacing={1}>
									<Typography variant="h3">
										{title}
									</Typography>
									{confirmed && <IcCheckmarkCircle />}
								</Stack>
								{confirmed && (
									<Typography
										color="#00C29F"
										variant="subtitle2">
										{subtitle}
									</Typography>
								)}
							</Stack>
						</Stack>
						<Divider />
						<Grid
							container
							sx={{
								color: '#000',
								'& h5': {
									fontSize: '14px',
									lineHeight: '20px',
									fontWeight: 700,
								},
								'& p': {
									fontSize: '14px',
									lineHeight: '16.8px',
									fontWeight: 400,
								},
							}}>
							<Grid
								item
								xs={5}
								style={{
									marginTop: '4px',
									marginBottom: '10px',
								}}>
								<Typography variant="h5">
									연동 쇼핑몰 ID
								</Typography>
							</Grid>
							<Grid
								item
								xs={7}
								style={{
									marginTop: '4px',
									marginBottom: '10px',
								}}>
								<Typography variant="body1">
									{mallId}
								</Typography>
							</Grid>
							<Grid item xs={5} style={gridStyle}>
								<Typography variant="h5">
									개런티 발급시점
								</Typography>
							</Grid>
							<Grid item xs={7} style={gridStyle}>
								<Typography variant="body1">
									{issueTiming}
								</Typography>
							</Grid>
							<Grid item xs={5} style={gridStyle}>
								<Typography variant="h5">
									개런티 발급상품
								</Typography>
							</Grid>
							<Grid item xs={7} style={gridStyle}>
								<Typography variant="body1">
									{targetProduct}
								</Typography>
							</Grid>
							<Grid
								item
								xs={5}
								style={{
									marginTop: '10px',
								}}>
								<Typography variant="h5">
									개런티 소개 알림톡 발송
								</Typography>
							</Grid>
							<Grid
								item
								xs={7}
								style={{
									marginTop: '10px',
								}}>
								<Typography variant="body1">발송함</Typography>
							</Grid>
						</Grid>
					</Stack>
				</Card>
				{confirmed ? (
					<Button
						sx={{width: 240}}
						type="submit"
						variant="contained"
						color="primary"
						onClick={moveToServiceInterworkPage}>
						연동 완료
					</Button>
				) : (
					<Button
						sx={{width: 240}}
						type="submit"
						variant="contained"
						color="primary"
						disabled={!value}
						onClick={moveNext}
						data-tracking={`cafe24_linkorder_click,{pv_title: '연동하기'}`}>
						{confirmLoading ? (
							<CircularProgress color="inherit" size={15} />
						) : (
							'연동하기'
						)}
					</Button>
				)}
			</Stack>
		</Stack>
	);
}

const IcCheckmarkCircle = () => (
	<svg
		focusable="false"
		aria-hidden="true"
		viewBox="0 0 24 24"
		width="16"
		height="16"
		fill="#00876e">
		<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
	</svg>
);
