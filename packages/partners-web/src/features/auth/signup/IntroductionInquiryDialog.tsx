import {useCallback, useEffect} from 'react';
import {Controller, FieldError, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {
	Box,
	Typography,
	TextField as MuiTextField,
	TextFieldProps as MuiTextFieldProps,
	Stack,
	FormControlLabel,
	Checkbox,
	FormControl,
	FormHelperText,
} from '@mui/material';

import {Dialog, Button} from '@/components';

import {introductionInquirySchemaShape} from '@/utils/schema';
import {handleChangeDataFormat} from '@/utils';

import {sendSlack} from '@/api/common.api';
import {useMessageDialog} from '@/stores';

const inputList = [
	{
		type: 'text',
		name: 'name',
		placeholder: '담당자 이름',
		defaultValue: '',
		required: true,
	},
	{
		type: 'text',
		name: 'email',
		placeholder: '이메일 주소',
		defaultValue: '',
		required: true,
	},
	{
		type: 'text',
		name: 'companyName',
		placeholder: '회사명',
		defaultValue: '',
		required: true,
	},
	{
		type: 'phone',
		name: 'phoneNum',
		placeholder: '휴대전화번호',
		defaultValue: '',
		required: true,
	},
	{
		type: 'text',
		name: 'department',
		placeholder: '담당부서 및 직책',
		defaultValue: '',
		required: false,
	},
	{
		type: 'content',
		name: 'content',
		placeholder: '문의 내용을 입력해주세요',
		defaultValue: '',
		required: false,
		multiline: true,
		rows: 4,
	},
];

interface Props {
	open: boolean;
	onClose: () => void;
}

const defaultValues = inputList
	.map((item: {name: string}) => item.name)
	.reduce((acc: Record<string, any>, cur) => {
		return {...acc, [cur]: ''};
	}, {});

interface FormProps {
	name: string;
	email: string;
	companyName: string;
	phoneNum: string;
	department?: string;
	content?: string;
	isAgree: boolean;
}

/**
 *
 * 도입 문의 모달
 * 루트 경로에서 도입문의, 회원가입에서 병행업체 가입문의와 함께 사용됨
 */
function IntroductionInquiryDialog({open, onClose}: Props) {
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const setOnCloseFunc = useMessageDialog((state) => state.setOnCloseFunc);

	useEffect(() => {
		if (onClose) {
			setOnCloseFunc && setOnCloseFunc(onClose);
		}
	}, [onClose, setOnCloseFunc]);

	const {
		control,
		handleSubmit,
		formState: {errors},
	} = useForm<FormProps>({
		resolver: yupResolver(introductionInquirySchemaShape),
		mode: 'onSubmit',
		reValidateMode: 'onBlur',
		defaultValues: {...defaultValues, ...{isAgree: false}},
	});

	const handleDataSubmit = useCallback(async (data: FormProps) => {
		try {
			await sendSlack({
				type: 'cooperator',
				title: '파트너스 도입문의',
				data: {
					담당자: data.name,
					이메일: data.email,
					회사명: data.companyName,
					핸드폰: data.phoneNum,
					'담당부서 및 직책': data.department,
					문의내용: data.content ? `\n${data.content}` : '',
				},
			});

			onOpenMessageDialog({
				title: '문의하신 내용이 접수되었습니다.',
				message:
					'문의 내용을 확인한 후 빠르 시일 내에 답변 드리겠습니다.',
			});
		} catch (e) {
			console.log(e);
		}
	}, []);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			showCloseButton
			TitleComponent={
				<Typography fontSize={24} fontWeight={700}>
					병행수입 서비스 도입 문의
				</Typography>
			}
			maxWidth="sm"
			fullWidth>
			<>
				<Typography fontSize={15} fontWeight={400} mb="24px">
					문의사항을 남겨주시면, 확인 후 바로 연락드리겠습니다
				</Typography>
				<form onSubmit={handleSubmit(handleDataSubmit)}>
					<Stack direction="column" rowGap="10px">
						{inputList.map((input) => (
							<Controller
								key={input.name}
								name={input.name as keyof FormProps}
								control={control}
								render={({
									field: {onChange, onBlur, value},
									fieldState: {error},
								}) => (
									<TextField
										key={input.name}
										error={error}
										{...input}
										value={value}
										onBlur={onBlur}
										onChange={(e) => {
											if (input.name === 'phoneNum') {
												e.target.value =
													handleChangeDataFormat(
														'phoneNum',
														e
													);
											}
											onChange(e);
										}}
									/>
								)}
							/>
						))}
						<Controller
							name="isAgree"
							control={control}
							render={({
								field: {onChange, value},
								fieldState: {error},
							}) => {
								return (
									<FormControl error={error ? true : false}>
										<FormControlLabel
											sx={{
												m: 0,
												alignItems: 'center',
											}}
											control={
												<Checkbox
													name="isAgree"
													onChange={onChange}
													checked={value}
													sx={{
														'& .MuiSvgIcon-root': {
															color: value
																? 'primary.main'
																: '#ECECED',
														},
													}}
												/>
											}
											label={
												<Box
													fontSize={14}
													fontWeight={500}
													color="#858585">
													<Typography
														display="inline-block"
														className="underline cursor-pointer"
														fontSize={14}
														fontWeight={700}
														color="#858585"
														onClick={(e) => {
															e.preventDefault();
															window.open(
																`https://mation.notion.site/Mass-adoption-55f0ccb4efbf475384ae2bbb6014dc90`
															);
														}}>
														개인정보처리방침
													</Typography>
													에 동의합니다.
												</Box>
											}
										/>
										<FormHelperText>
											{error?.message}
										</FormHelperText>
									</FormControl>
								);
							}}
						/>
						<Button type="submit">문의하기</Button>
					</Stack>
				</form>
			</>
		</Dialog>
	);
}

interface TextFieldProps extends Omit<MuiTextFieldProps, 'error'> {
	error?: FieldError;
}

const TextField = ({required, error, ...props}: TextFieldProps) => {
	const {defaultValue, ...rest} = props;
	return (
		<Box position="relative">
			{required && (
				<strong
					style={{
						fontWeight: 700,
						fontSize: '14px',
						marginRight: '4px',
						position: 'absolute',
						left: '16px',
						top: '16px',
						zIndex: 5,
						color: '#FF004D',
					}}>
					*
				</strong>
			)}
			<MuiTextField
				fullWidth
				error={error ? true : false}
				helperText={error?.message || null}
				{...rest}
				InputProps={{
					sx: {
						backgroundColor: '#FCFCFD',
						borderRadius: '4px',
					},
				}}
				sx={{
					'& input': {
						paddingLeft: '24px',
						width: '100%',
					},
					'& textarea': {
						paddingLeft: '10px',
					},
					'& input::placeholder, & textarea::placeholder': {
						color: '#858585',
						opacity: 1,
						fontWeight: 500,
						fontSize: '15px',
						lineHeight: '19px',
					},
				}}
			/>
		</Box>
	);
};

export default IntroductionInquiryDialog;
