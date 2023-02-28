import {useMemo, useState} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
	Control,
	FieldArrayWithId,
	useFieldArray,
	useForm,
	UseFormSetFocus,
} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {AxiosError} from 'axios';

import {InputProps, Stack, Typography} from '@mui/material';

import {
	Dialog,
	Button,
	InputWithLabel,
	InputLabelTag,
	ControlledInputComponent,
} from '@/components';
import {RegisterCardRequestParam} from '@/@types';
import {onChangeOnlyNumber} from '@/utils';
import {emailSchemaValidation} from '@/utils/schema';
import {registerCard} from '@/api/payment.api';
import {useGlobalLoading, useMessageDialog} from '@/stores';

interface RegisterCardForm
	extends Omit<RegisterCardRequestParam, 'cardNumber'> {
	cardNumber: {
		value: string;
	}[];
}

type AddPaymentCardInput = Partial<Omit<InputProps, 'error'>> & {
	label?: string;
	desc?: string;
};

type AddPaymentCardInputList = AddPaymentCardInput | AddPaymentCardInput[];

const inputList: AddPaymentCardInputList[] = [
	// 카드번호
	// 배열로 관리
	new Array(4).fill(null).map((_, idx) => ({
		type: idx === 2 ? 'password' : 'text', // 3번째 칸만 마스킹 처리
		name: `cardNumber${idx}`,
		placeholder: new Array(4).fill('●').join(''),
		label: '카드번호',
		autoComplete: 'off',
		required: true,
		inputProps: {
			maxLength: 4,
		},
		className: 'password-mark',
	})),
	[
		{
			type: 'text',
			name: 'cardExpirationMonth',
			placeholder: 'MM',
			label: '유효기간',
			autoComplete: 'off',
			required: true,
			inputProps: {
				maxLength: 2,
			},
			className: 'password-mark',
		},
		{
			type: 'text',
			name: 'cardExpirationYear',
			placeholder: 'YY',
			label: '유효기간',
			autoComplete: 'off',
			required: true,
			inputProps: {
				maxLength: 2,
			},
			className: 'password-mark',
		},
	],
	{
		type: 'password',
		name: 'cardPassword',
		placeholder: new Array(2).fill('●').join(''),
		label: '비밀번호 앞 2자리',
		autoComplete: 'off',
		required: true,
		inputProps: {
			maxLength: 2,
		},
		className: 'password-mark',
	},
	{
		type: 'text',
		name: 'customerIdentityNumber',
		placeholder: '000000',
		label: '생년월일 6자리',
		autoComplete: 'off',
		required: false,
		desc: '법인카드의 경우 사업등록번호 10자리를 입력해주세요',
		inputProps: {
			maxLength: 10,
		},
	},
	{
		type: 'text',
		name: 'customerEmail',
		placeholder: '이메일을 지정해주세요.',
		label: '결제용 이메일',
		autoComplete: 'off',
		required: false,
		desc: '결제 정보를 받을 이메일을 지정해주세요. 비워두면 결제 관련 메일을 받아볼 수 없어요.',
	},
];
interface Props {
	open: boolean;
	onClose: () => void;
	afterAddPaymentCardFunc?: () => void;
}

function AddPaymentCardModal({open, onClose, afterAddPaymentCardFunc}: Props) {
	const onMessageDialogOpen = useMessageDialog((state) => state.onOpen);
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);
	const queryClient = useQueryClient();
	const {
		control,
		handleSubmit,
		setFocus,
		formState: {errors},
	} = useForm<RegisterCardForm>({
		defaultValues: {
			cardNumber: [{value: ''}, {value: ''}, {value: ''}, {value: ''}],
			cardExpirationYear: '',
			cardExpirationMonth: '',
			cardPassword: '',
			customerIdentityNumber: '',
			customerEmail: '',
		},
		resolver: yupResolver(
			yup.object().shape({
				cardNumber: yup.array().of(
					yup.object().shape({
						value: yup
							.string()
							.required('카드번호를 입력해주세요.'),
					})
				),
				cardExpirationYear: yup
					.string()
					.required('카드 유효기간을 입력해주세요.'),
				cardExpirationMonth: yup
					.string()
					.required('카드 유효기간을 입력해주세요.'),
				cardPassword: yup
					.string()
					.required('비밀번호 앞2자리를 입력해주세요.'),
				customerIdentityNumber: yup
					.string()
					.required(
						'생년월일 6자리 혹은 사업등록번호 10자리를 입력해주세요.'
					),
				customerEmail: emailSchemaValidation,
			})
		),
		mode: 'onSubmit',
		reValidateMode: 'onSubmit',
	});
	const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

	const errorMessage = useMemo<string | undefined>(() => {
		const errorsArray = Object.entries(errors).map((error) => {
			const [key, value] = error;
			if (Array.isArray(value) && value?.length > 0) {
				return value?.find((item) => item?.value?.message)?.value
					?.message;
			}
			return value?.message;
		});
		return errorsArray.find((error) => error) || apiErrorMessage;
	}, [errors, apiErrorMessage]);

	const {fields} = useFieldArray({
		control,
		name: 'cardNumber',
	});

	const registerPaymentCardMutation = useMutation({
		onMutate: () => {
			setIsLoading(true);
		},
		mutationFn: async (data: RegisterCardRequestParam) =>
			registerCard(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['userPricePlan'],
			});

			// 구독변경 과정 중 넘어온 경우
			if (afterAddPaymentCardFunc) {
				onClose();
				afterAddPaymentCardFunc();
				return;
			}
			onMessageDialogOpen({
				title: '결제 카드를 등록했습니다.',
				showBottomCloseButton: true,
				closeButtonValue: '확인',
				onCloseFunc: onClose,
			});
		},
		onError: (e) => {
			const error = (e as AxiosError)?.response;
			if (error?.status == 400) {
				const errorMessage = error?.data?.message;
				setApiErrorMessage(
					errorMessage === 'ALREADY_REGISTERED_BILLING'
						? '이미 카드가 등록되어있습니다. 기존 결제 카드를 삭제하고 다시 등록해주세요.'
						: errorMessage // 기타 400 에러는 토스 에러 메시지
				);
				return;
			}
			setApiErrorMessage(
				'결제 카드 등록에 실패했습니다. 다시 시도해주세요.'
			);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	const onSubmit = async (data: RegisterCardForm) => {
		const param = {
			...data,
			cardNumber: data.cardNumber.map((item) => item.value).join(''),
		};
		await registerPaymentCardMutation.mutateAsync(param);
	};

	return (
		<Dialog
			open={open}
			showCloseButton={true}
			onClose={onClose}
			TitleComponent={
				<Typography
					component="span"
					variant="header1"
					fontWeight="bold">
					결제 카드 등록
				</Typography>
			}
			ActionComponent={
				<Stack
					flexDirection="row"
					sx={{
						width: '100%',
						justifyContent: 'flex-end',
						gap: '12px',
					}}>
					<Button
						variant="outlined"
						color="grey-100"
						height={32}
						onClick={onClose}>
						취소
					</Button>
					<Button
						height={32}
						type="submit"
						onClick={() => {
							handleSubmit(onSubmit)();
						}}>
						등록
					</Button>
				</Stack>
			}>
			<Stack>
				<form noValidate>
					{inputList.map(
						(
							input: AddPaymentCardInput | AddPaymentCardInput[],
							idx
						) => {
							if ((input as AddPaymentCardInput[])?.length > 1) {
								const firstInput = (
									input as AddPaymentCardInput[]
								)[0];
								const name = firstInput.name;
								// 카드번호
								if (name === 'cardNumber0') {
									return (
										<CardNumberInputList
											key={`payment_input_card_number_${idx}`}
											inputs={
												input as AddPaymentCardInput[]
											}
											control={control}
											fields={fields}
											setFocus={setFocus}
										/>
									);
								}
								// 유효기간
								if (name === 'cardExpirationMonth') {
									return (
										<CardExpirationInput
											key={`payment_input_card_expiration_${idx}`}
											inputs={
												input as AddPaymentCardInput[]
											}
											control={control}
											setFocus={setFocus}
										/>
									);
								}
							}
							const {type, name, label} =
								input as AddPaymentCardInput;
							if (type === 'hidden') {
								return null;
							}
							return (
								<InputWithLabel
									key={`payment_input_${idx}`}
									type={type as string}
									name={name as string}
									labelTitle={label as string}
									showRequiredChip={false}
									control={control}
									isLast={name === 'customerEmail'}
									{...(name !== 'customerEmail' && {
										onChange: onChangeOnlyNumber,
									})}
									{...(name === 'cardPassword' && {
										onChange: (e) => {
											onChangeOnlyNumber(e);
											const length =
												e?.target?.value?.length;
											if (length === 2) {
												setFocus(
													'customerIdentityNumber'
												);
											}
										},
									})}
									{...input}
								/>
							);
						}
					)}
					{errorMessage && (
						<Typography variant="caption1" color="red.main">
							{errorMessage}
						</Typography>
					)}
				</form>
			</Stack>
		</Dialog>
	);
}

const CardNumberInputList = ({
	inputs,
	control,
	fields,
	setFocus,
}: {
	inputs: AddPaymentCardInput[];
	control: Control<any, any>;
	fields: FieldArrayWithId<RegisterCardForm, 'cardNumber', 'id'>[];
	setFocus: UseFormSetFocus<RegisterCardForm>;
}) => {
	const firstInput = inputs[0];
	return (
		<Stack mb="24px">
			<InputLabelTag
				required={!!firstInput?.required}
				showRequiredChip={false}
				labelTitle={firstInput?.label as string}
			/>
			<Stack
				className="wrapper"
				flexDirection="row"
				gap="10px"
				sx={{
					'& > .MuiGrid-root': {
						maxWidth: '85px !important',
					},
				}}>
				{fields.map((_, idx) => {
					const fieldInput = inputs[idx];
					const {name, ...restFieldInput} = fieldInput;
					return (
						<ControlledInputComponent
							key={`cardNumber.cardNumber${idx}`}
							name={`cardNumber[${idx}].value`}
							type={fieldInput['type'] as string}
							control={control}
							onChange={(e) => {
								onChangeOnlyNumber(e);
								const length = e?.target?.value?.length;
								if (length === 4) {
									if (idx === 3) {
										setFocus('cardExpirationMonth');
										return;
									}
									setFocus(`cardNumber[${idx + 1}].value`);
								}
							}}
							{...restFieldInput}
						/>
					);
				})}
			</Stack>
		</Stack>
	);
};

const CardExpirationInput = ({
	inputs,
	control,
	setFocus,
}: {
	inputs: AddPaymentCardInput[];
	control: Control<any, any>;
	setFocus: UseFormSetFocus<RegisterCardForm>;
}) => {
	const firstInput = inputs[0];
	return (
		<Stack mb="24px">
			<InputLabelTag
				required={!!firstInput?.required}
				showRequiredChip={false}
				labelTitle={firstInput?.label as string}
			/>
			<Stack
				className="wrapper"
				flexDirection="row"
				gap="10px"
				sx={{
					'& > .MuiGrid-root': {
						maxWidth: '69px !important',
					},
				}}>
				{inputs.map((item, idx) => {
					return (
						<>
							<ControlledInputComponent
								key={`payment_input_item_card_expiration_${idx}`}
								type={item.type as string}
								name={item.name as string}
								control={control}
								onChange={(e) => {
									onChangeOnlyNumber(e);
									const length = e?.target?.value?.length;
									if (length === 2) {
										if (idx === 0) {
											setFocus('cardExpirationYear');
											return;
										}
										setFocus('cardPassword');
									}
								}}
								{...item}
							/>
						</>
					);
				})}
			</Stack>
		</Stack>
	);
};

export default AddPaymentCardModal;
