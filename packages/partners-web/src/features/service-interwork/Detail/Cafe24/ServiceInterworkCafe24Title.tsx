import {useMemo, useState} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';

import {SelectChangeEvent, Stack, Typography} from '@mui/material';

import {useChildModalOpen} from '@/utils/hooks';
import {updateLeaveReason} from '@/api/cafe24.api';
import {goToParentUrl, usePageView} from '@/utils';
import {Cafe24Interwork} from '@/@types';

import {Button, Select, Dialog, TextField} from '@/components';
import Cafe24Logo from '@/assets/images/cafe24/cafe24_logo.png';
import Cafe24Logo2x from '@/assets/images/cafe24/cafe24_logo@2x.png';
import ServiceInterworkDetailTitle from '@/features/service-interwork/Detail/common/ServiceInterworkDetailTitle';

const reasonList = [
	'자동 개런티 발급 부담',
	'이용이 불편하고 장애가 많아서',
	'개런티 발급이 필요 없음',
	'기타',
];

interface Props {
	data?: Cafe24Interwork;
}

function ServiceInterworkCafe24Title({data: cafe24Interwork}: Props) {
	const {open, onOpen, onClose} = useChildModalOpen({});

	const InstallButton = useMemo(() => {
		return (
			<Button
				data-tracking={`'cafe24_stratpopupview', {pv_title: '카페24 연동시작 팝업'}`}
				onClick={() => {
					window.open('https://store.cafe24.com/kr/apps/16145');
				}}>
				연동하기
			</Button>
		);
	}, []);

	const UninstallButton = useMemo(() => {
		return (
			<Button
				variant="outlined"
				color="grey-100"
				data-tracking={`'cafe24_linkservicedetail_clearcafe24_click', {pv_title: '연동해제'}`}
				onClick={onOpen}>
				연동해제
			</Button>
		);
	}, [onOpen]);

	return (
		<>
			<ServiceInterworkDetailTitle
				title="카페24 주문연동"
				subTitle="카페24 쇼핑몰 주문연동하고 자동으로 개런티를 발급하세요!"
				isLinked={!!cafe24Interwork}
				mb="40px"
				titleImgBackgroundColor="#D9EFFF"
				TitleImg={
					<img
						src={Cafe24Logo}
						srcSet={`${Cafe24Logo2x} 2x`}
						width="78"
						alt="cafe24-logo"
					/>
				}
				Button={cafe24Interwork ? UninstallButton : InstallButton}
			/>
			{cafe24Interwork?.mallId && open && (
				<UninstallModal
					open={open}
					onClose={onClose}
					mallId={cafe24Interwork?.mallId}
				/>
			)}
		</>
	);
}

const UninstallModal = ({
	open,
	onClose,
	mallId,
}: {
	open: boolean;
	onClose: () => void;
	mallId: string;
}) => {
	usePageView(
		'cafe24_linkservicedetail_clearcafe24_popupview',
		'연동해제 팝업 노출'
	);
	const queryClient = useQueryClient();
	const [reason, setReason] = useState<string>('');
	const [reasonDetail, setReasonDetail] = useState<string>('');

	const onChangeReason = (e: SelectChangeEvent<unknown>) => {
		const value = e.target.value as string;
		if (value === '기타') {
			setReasonDetail('');
		}
		setReason(value);
	};

	const updateLeaveReasonMutation = useMutation({
		mutationFn: () => {
			return updateLeaveReason(
				mallId,
				`${reason} ${reasonDetail}`.trim()
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['getInterworkByToken'],
			});
			onClose();
			window.open(
				`https://${mallId}.cafe24.com/disp/admin/shop1/myapps/list`
			);
			goToParentUrl('/b2b/interwork');
		},
		onError: () => {
			// 예외처리
		},
	});
	return (
		<Dialog
			open={open}
			onClose={onClose}
			TitleComponent={
				<Typography fontSize={21} fontWeight="bold">
					카페24 주문연동을 해제하시겠습니까?
				</Typography>
			}
			sx={{
				'& .MuiPaper-root': {
					width: '520px',
					minHeight: '197px',
					borderRadius: '16px',
				},
			}}>
			<>
				<Typography variant="body1" color="grey.600" mb="10px">
					연동해제는 카페24 관리자 페이지, 마이 앱에서 “버클"을
					삭제하면 완료됩니다.
				</Typography>
				<Select
					width="100%"
					placeholder="해제 이유를 선택헤주세요"
					options={reasonList.map((item) => ({
						label: item,
						value: item,
					}))}
					value={reason}
					onChange={onChangeReason}
				/>
				{reason === '기타' && (
					<TextField
						sx={{
							marginTop: '10px',
							width: '100%',
						}}
						value={reasonDetail}
						onChange={(e) => {
							setReasonDetail(e.target.value);
						}}
					/>
				)}
				<Stack
					flexDirection="row"
					mt="40px"
					mb="16px"
					justifyContent="flex-end"
					gap="8px">
					<Button
						variant="outlined"
						color="grey-100"
						onClick={onClose}>
						취소
					</Button>
					<Button
						color="black"
						disabled={!reason ? true : false}
						data-tracking={`'cafe24_linkservicedetail_clearcafe24_popup_clear_click', {pv_title: '해제하기'}`}
						onClick={updateLeaveReasonMutation.mutateAsync}>
						연동해제
					</Button>
				</Stack>
			</>
		</Dialog>
	);
};

export default ServiceInterworkCafe24Title;
