import {useEffect, useState} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';

import {Grid, Stack, Typography} from '@mui/material';

import {useMessageDialog} from '@/stores';
import {
	Cafe24Interwork,
	IssueCategory,
	IssueSetting,
	IssueTiming,
	Options,
} from '@/@types';
import {updateSetting} from '@/api/cafe24.api';
import {sendAmplitudeLog} from '@/utils';

import {Button, RadioGroup} from '@/components';
import SettingCategory from '@/features/service-interwork/Detail/Cafe24/ServiceInterworkCafe24SettingCategory';

const cafe24IssueTimingOptions: Options<IssueTiming> = [
	{label: '배송완료', value: 'AFTER_DELIVERED'},
	{label: '수동발급', value: 'AFTER_SHIPPING'},
];

const cafe24IssueAllOptions: Options<boolean> = [
	{label: '전체상품', value: true},
	{label: '카테고리', value: false},
];

const cafe24AlimtalkOptions: Options<boolean> = [
	{label: '발송함', value: true},
	{label: '발송안함', value: false},
];

interface Props {
	data?: Cafe24Interwork;
}

function ServiceInterworkCafe24SettingForm({data: cafe24Interwork}: Props) {
	const queryClient = useQueryClient();
	const [formData, setFormData] = useState<IssueSetting>({
		issueIntro: true,
		issueTiming: 'AFTER_DELIVERED',
		manually: false,
		issueAll: true,
		issueCategories: [],
	});

	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const onOpenError = useMessageDialog((state) => state.onOpenError);

	useEffect(() => {
		const issueSetting = cafe24Interwork?.issueSetting;
		if (!issueSetting) {
			return;
		}
		setFormData((prev) => ({
			...prev,
			...issueSetting,
		}));
	}, [cafe24Interwork?.issueSetting]);

	const updateSettingMutation = useMutation({
		mutationFn: () => {
			return updateSetting(cafe24Interwork?.mallId, formData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['getInterworkByToken'],
			});
			onOpenMessageDialog({
				title: '카페24 연동 설정이 변경되었습니다.',
				showBottomCloseButton: true,
				closeButtonValue: '확인',
			});
		},
		onError: () => {
			onOpenError();
		},
	});

	const onAddCategory = (value: IssueCategory[]) => {
		setFormData((prev) => ({
			...prev,
			issueCategories: value,
		}));
	};

	const onRemoveCategory = (categoryIdx: number) => {
		setFormData((prev) => ({
			...prev,
			issueCategories: prev.issueCategories.filter(
				(item) => item.idx !== categoryIdx
			),
		}));
	};

	return (
		<>
			<Stack>
				<Stack
					borderBottom={(theme) =>
						`1px solid ${theme.palette.grey[100]}`
					}
					mb="20px">
					<Typography variant="subtitle1" mb="30px">
						연동 설정
					</Typography>
					<Grid
						container
						columns={{
							xs: 1,
							sm: 4,
						}}
						sx={{
							'& .MuiGrid-item': {
								display: 'flex',
								alignItems: 'center',
								'&:nth-of-type(5)': {
									alignItems: 'flex-start',
									paddingTop: {
										sm: '8px',
									},
								},
							},
							'& .MuiGrid-item:nth-of-type(n+3)': {
								paddingTop: {
									xs: '10px',
									sm: '20px',
								},
							},
							paddingBottom: '26px',
						}}>
						<Grid item xs={1} sm={1}>
							<Typography variant="body3" fontWeight="bold">
								연동 쇼핑몰 ID
							</Typography>
						</Grid>
						<Grid item xs={1} sm={3}>
							<Typography variant="body3">
								{cafe24Interwork?.mallId}
							</Typography>
						</Grid>
						<Grid item xs={1} sm={1}>
							<Typography variant="body3" fontWeight="bold">
								개런티 발급시점
							</Typography>
						</Grid>
						<Grid item xs={1} sm={3}>
							<RadioGroup
								ariaLabel="issue timing label"
								value={formData.issueTiming}
								options={cafe24IssueTimingOptions}
								onChange={(value) => {
									if ('AFTER_DELIVERED' === value) {
										sendAmplitudeLog(
											'cafe24_linkservicedetail_delivercomplate_click',
											{
												button_title:
													'개런티 자동발급 항목 선택',
											}
										);
									}
									if ('AFTER_SHIPPING' === value) {
										sendAmplitudeLog(
											'cafe24_linkservicedetail_directly_click',
											{
												button_title:
													'개런티 자동발급 항목 선택',
											}
										);
									}
									setFormData((prev) => ({
										...prev,
										issueTiming: value,
									}));
								}}
							/>
						</Grid>
						<Grid item xs={1} sm={1}>
							<Typography
								variant="body3"
								fontWeight="bold"
								mt="6px">
								개런티 발급상품
							</Typography>
						</Grid>
						<Grid
							item
							xs={1}
							sm={3}
							borderBottom={(theme) =>
								`1px solid ${theme.palette.grey[100]}`
							}
							pb="20px">
							<Stack rowGap={{xs: 0, sm: '20px'}}>
								<RadioGroup
									ariaLabel="issue category label"
									value={formData.issueAll}
									options={cafe24IssueAllOptions}
									onChange={(value: string) => {
										if (value) {
											sendAmplitudeLog(
												'cafe24_linkservicedetail_all_click',
												{
													button_title:
														'개런티 발급발급 항목 선택',
												}
											);
										}
										if (!value) {
											sendAmplitudeLog(
												'cafe24_linkservicedetail_category_click',
												{
													button_title:
														'개런티 발급발급 항목 선택',
												}
											);
										}
										setFormData((prev) => ({
											...prev,
											issueAll: JSON.parse(value),
										}));
									}}
								/>
								{!formData.issueAll &&
									cafe24Interwork?.mallId && (
										<SettingCategory
											mallId={cafe24Interwork.mallId}
											selectedCategoryList={
												formData.issueCategories
											}
											onAddCategory={onAddCategory}
											onRemoveCategory={onRemoveCategory}
										/>
									)}
							</Stack>
						</Grid>
						<Grid item xs={1} sm={1}>
							<Typography variant="body3" fontWeight="bold">
								개런티 소개 알림톡 발송
							</Typography>
						</Grid>
						<Grid item xs={1} sm={3}>
							<RadioGroup
								ariaLabel="issue intro label"
								value={formData.issueIntro}
								options={cafe24AlimtalkOptions}
								onChange={(value: string) => {
									setFormData((prev) => ({
										...prev,
										issueIntro: JSON.parse(value),
									}));
								}}
							/>
						</Grid>
					</Grid>
				</Stack>
				<Stack flexDirection="row" gap="8px" mb="24px">
					<Button
						color="primary"
						height={32}
						data-tracking={`cafe24_linkservicedetail_save_click,{'button_title': '선택사항 저장'}`}
						onClick={async () => {
							if (!cafe24Interwork?.mallId || !formData) {
								return;
							}
							await updateSettingMutation.mutateAsync();
						}}>
						저장
					</Button>
					<Button
						color="blue-50"
						height={32}
						data-tracking={`cafe24_linkservicedetail_goingcafe24_click,{'button_title': 'cafe24로 이동'}`}
						onClick={() => {
							if (!cafe24Interwork?.mallId) return;
							window.open(
								`https://${cafe24Interwork?.mallId}.cafe24.com/admin/php/main.php`
							);
						}}>
						카페24 바로가기
					</Button>
				</Stack>
			</Stack>
		</>
	);
}

export default ServiceInterworkCafe24SettingForm;
