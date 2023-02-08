import React, {useEffect, useState} from 'react';
import {Controller, FieldError, useForm, FieldValues} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import styled from '@emotion/styled';
import {inquiryInputSchema} from '@/utils/schema';
import {sendSlack} from '@/api/common.api';

import {useMessageDialog} from '@/stores';

import {goToParentUrl, sendAmplitudeLog, handleChangeDataFormat} from '@/utils';

import {iconIndexFinger, iconDocs} from '@/assets/images/homepage/index';
import {ControlledInputComponent, Checkbox, Button} from '@/components';
import {Stack} from '@mui/material';
import AtagComponent from '@/components/atoms/AtagComponent';

type ButtonActiveProps = {
	activate: boolean;
};

const InquiryFormContainerStyle = styled('section')`
	padding: 75px 0px 86px;

	@media (max-width: 820px) {
		padding: 75px 24px 86px;
	}
	@media (max-width: 480px) {
		padding: 75px 27.5px 86px;
	}
`;
const InquiryWrapStyle = styled('div')`
	max-width: 1200px;
	margin: auto;
	display: flex;
	flex-direction: column;
`;
const MainTextAreaStyle = styled('div')`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 45px;

	h2 {
		font-weight: 700;
		font-size: 40px;
		line-height: 48px;
		text-align: center;
		color: #ffffff;
		margin: 0;
		margin-bottom: 16px;
	}
	h3 {
		font-weight: 500;
		font-size: 16px;
		line-height: 19px;
		text-align: center;
		color: #ffffff;
		margin: 0;
	}

	@media (max-width: 480px) {
		margin-bottom: 24px;

		h2 {
			font-size: 24px;
			margin-bottom: 8px;
		}
		h3 {
			font-size: 14px;
			margin-bottom: 0px;
		}
	}
`;

const InputBoxStyle = styled('div')`
	display: flex;
	flex-direction: column;
	gap: 20px;
	max-width: 536px;
	width: 100%;
	margin: auto;
	margin-bottom: 32px;

	@media (max-width: 480px) {
		margin-bottom: 24px;
	}
`;

const InquiryButtonWrapStyle = styled('div')<ButtonActiveProps>`
	width: 100%;
	display: flex;
	justify-content: center;

	button {
		max-width: 536px;
		width: 100%;
		height: 60px;
		background: ${({activate}) =>
			activate
				? 'linear-gradient(98.38deg, #5d9bf9 43.58%, #5c3ef6 104.42%);'
				: 'grey'};
		border-radius: 6px;
		font-weight: 700;
		font-size: 20px;
		line-height: 60px;
		text-align: center;
		color: #ffffff;
		margin: auto;
		outline: none;
		border: 0;
		cursor: pointer;
	}
`;

const InquiryInputBoxStyle = styled('div')`
	display: flex;
	flex-direction: column;
	gap: 8px;
	width: 100%;
	min-height: 76px;

	div {
		display: flex;
		gap: 8px;
		align-items: center;

		h3 {
			font-weight: 700;
			font-size: 14px;
			line-height: 16px;
			color: #ffffff;
			margin: 0;
		}
	}
	input {
	}
`;

const RequiredTagStyle = styled('div')`
	font-weight: 700;
	font-size: 11px;
	line-height: 20px;
	color: #f8434e;
	padding: 0px 5px;
	width: 31px;
	height: 20px;
	background: #fff2f3;
	border-radius: 4px;
`;

const CheckboxSectionStyle = styled('div')`
	display: flex;
	flex-direction: column;
	margin: auto;
	margin-bottom: 40px;
	gap: 16px;
	max-width: 536px;
	width: 100%;

	@media (max-width: 480px) {
		margin-bottom: 32px;
	}
`;

const CheckboxBoxStyle = styled('div')`
	p {
		font-weight: 500;
		font-size: 11px;
		line-height: 145%;
		margin: 0;
		color: #cacad3;
	}

	@media (max-width: 480px) {
		p {
			color: #5c5c65;
		}
	}
`;

const CheckboxTitleStyle = styled('div')`
	display: flex;
	align-items: flex-start;
	gap: 9px;
	margin-bottom: 6px;
	max-width: 536px;
	width: 100%;

	div {
		font-weight: 500;
		font-size: 14px;
		line-height: 145%;
		color: #ffffff;
		opacity: 0.8;
		display: flex;
		align-items: center;
		flex-wrap: wrap;

		h3 {
			font-weight: 500;
			font-size: 14px;
			line-height: 145%;
			color: #526eff;
			opacity: 0.8;
			margin: 0;
		}
	}
`;

interface FormProps {
	name: string;
	email: string;
	companyName: string;
	phoneNum: string;
	department?: string;
	content?: string;
	isAgree: boolean;
}

type InquiryCheckboxType = {
	agreePersonalInfo: boolean;
	agreeMarketing: boolean;
};

const inputList = [
	{
		type: 'text',
		name: 'companyName',
		title: '기업명',
		placeholder: '기업명을 입력해주세요',
		defaultValue: '',
		required: true,
	},
	{
		type: 'text',
		name: 'name',
		title: '이름',
		placeholder: '담당자님의 이름을 입력해주세요',
		defaultValue: '',
		required: true,
	},
	{
		type: 'phone',
		name: 'phoneNum',
		title: '전화번호',
		placeholder: '010-1234-5678',
		defaultValue: '',
		required: true,
	},
];

const defaultValues = inputList
	.map((item: {name: string}) => item.name)
	.reduce((acc: Record<string, any>, cur) => {
		return {...acc, [cur]: ''};
	}, {});

function InquiryForm() {
	const {
		control,
		handleSubmit,
		reset,
		watch,
		getValues,
		formState: {errors},
	} = useForm<FieldValues>({
		resolver: yupResolver(inquiryInputSchema),
		mode: 'onSubmit',
		reValidateMode: 'onBlur',
		defaultValues: {...defaultValues},
	});

	const {onOpen, onClose} = useMessageDialog((state) => state);

	const [checkboxState, setCheckboxState] = useState<InquiryCheckboxType>({
		agreePersonalInfo: true,
		agreeMarketing: true,
	});

	const onSubmit = async () => {
		const values = getValues();
		sendAmplitudeLog('inquiry_confirm_bottom_click', {
			button_title: '도입문의 bottom 버튼 클릭',
		});

		try {
			const slackRes = await sendSlack({
				type: 'operation',
				title: '디지털 보증서 도입문의',
				data: {
					담당자: values.name,
					회사명: values.companyName,
					핸드폰: values.phoneNum,
					// 이메일: '',
					// '담당부서 및 직책': '',
					// 문의내용: '',
				},
			});

			if (slackRes) {
				onOpen({
					title: '도입문의가 완료되었습니다.',
					message:
						'영업일 기준 24시간 이내 도입과 관련해 연락드리겠습니다. 서비스에 대해 먼저 알아보고 싶으시다면 아래 버튼을 클릭해주세요.',
					buttons: (
						<Stack flexDirection={'row'} gap="8px">
							<Button
								variant="outlined"
								color="black"
								onClick={onClose}>
								닫기
							</Button>
							<AtagComponent url={'https://bit.ly/3XaTRBM'}>
								<Button
									color="black"
									onClick={() => {
										sendAmplitudeLog(
											'inquiry_confirm_popup_click',
											{
												button_title:
													'서비스 소개서 다운받기',
											}
										);
										onClose();
									}}>
									서비스 소개서 다운받기
								</Button>
							</AtagComponent>
						</Stack>
					),
					disableClickBackground: true,
				});
			}
		} catch (e) {}
	};

	return (
		<InquiryFormContainerStyle>
			<InquiryWrapStyle>
				<MainTextAreaStyle>
					<h2 id="inquiryForm">디지털 보증서를 도입해보세요!</h2>
					<h3>
						아래 정보를 제출해주시면 버클팀에서 영업일 기준 24시간
						이내 도입과 관련해 연락드리겠습니다.
					</h3>
				</MainTextAreaStyle>

				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					autoComplete="off">
					<InputBoxStyle>
						{inputList.map((input, idx) => (
							<InquiryInputBoxStyle
								key={`inquiry-input-index-${idx}`}>
								<div>
									<h3>{input.title}</h3>
									{input.required && (
										<RequiredTagStyle>
											필수
										</RequiredTagStyle>
									)}
								</div>

								<ControlledInputComponent
									type={'text'}
									name={input.name}
									placeholder={input.placeholder}
									required={input.required}
									control={control}
									error={errors && errors[input.name]}
									sx={{
										width: '100%',
									}}
									onChange={(e) => {
										if (input.name === 'phoneNum') {
											e.target.value =
												handleChangeDataFormat(
													'phoneNum',
													e
												);
										}
									}}
									inputProps={{
										maxLength:
											input.name === 'phoneNum'
												? 13
												: 100,
									}}
								/>
							</InquiryInputBoxStyle>
						))}
					</InputBoxStyle>

					<CheckboxSectionStyle>
						<CheckboxBoxStyle>
							<CheckboxTitleStyle>
								<Checkbox
									disabled={false}
									checked={checkboxState.agreePersonalInfo}
									onChange={(e) => {
										setCheckboxState((pre) => ({
											...pre,
											agreePersonalInfo:
												!pre.agreePersonalInfo,
										}));
									}}
								/>
								<div>
									[필수]
									<AtagComponent
										url={
											'https://guide.vircle.co.kr/policy/terms_220627'
										}>
										<h3>&nbsp;개인정보수집 및 이용 </h3>
									</AtagComponent>
									에 동의합니다.
								</div>
							</CheckboxTitleStyle>
							<p>
								수집된 정보는 제휴 콘텐츠, 프로모션, 이벤트 안내
								외 다른 목적으로 이용되지 않으며,
								<br />
								서비스가 종료될 경우 즉시 파기됩니다.
							</p>
						</CheckboxBoxStyle>

						<CheckboxBoxStyle>
							<CheckboxTitleStyle>
								<Checkbox
									disabled={false}
									checked={checkboxState.agreeMarketing}
									onChange={(e) => {
										setCheckboxState((pre) => ({
											...pre,
											agreeMarketing: !pre.agreeMarketing,
										}));
									}}
								/>
								<div>
									[선택]
									<AtagComponent
										url={'https://bit.ly/3I1wN4c'}>
										<h3>
											&nbsp;마케팅 활용 및 광고성
											정보&nbsp;
										</h3>{' '}
									</AtagComponent>
									수신 동의에 동의합니다.
								</div>
							</CheckboxTitleStyle>
							<p>
								제휴 콘텐츠, 프로모션, 이벤트 정보 등의 광고성
								정보를 수신합니다.
							</p>
						</CheckboxBoxStyle>
					</CheckboxSectionStyle>

					<InquiryButtonWrapStyle
						activate={checkboxState.agreePersonalInfo}>
						<button
							type="submit"
							disabled={!checkboxState.agreePersonalInfo}>
							도입문의
						</button>
					</InquiryButtonWrapStyle>
				</form>
			</InquiryWrapStyle>
		</InquiryFormContainerStyle>
	);
}

export default InquiryForm;
