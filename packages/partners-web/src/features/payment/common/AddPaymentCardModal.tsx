import {useMemo} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
	Control,
	FieldArrayWithId,
	useFieldArray,
	useForm,
} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

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
	const queryClient = useQueryClient();
	const {
		control,
		handleSubmit,
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

	const errorMessage = useMemo<string | undefined>(() => {
		const errorsArray = Object.entries(errors).map((error) => {
			const [key, value] = error;
			if (Array.isArray(value) && value?.length > 0) {
				return value?.find((item) => item?.value?.message)?.value
					?.message;
			}
			return value?.message;
		});
		return errorsArray.find((error) => error);
	}, [errors]);

	const {fields} = useFieldArray({
		control,
		name: 'cardNumber',
	});

	const registerPaymentCardMutation = useMutation({
		mutationFn: (data: RegisterCardRequestParam) => registerCard(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['userPricePlan'],
			});
			afterAddPaymentCardFunc && afterAddPaymentCardFunc();
		},
		onError: (e) => {
			console.log('error !!!!');
			console.log('e :>> ', e);
			// TODO: 에러 메시지 하단에 띄워줌
		},
	});

	// TODO:
	const onSubmit = async (data: RegisterCardForm) => {
		console.log('result data :>> ', data);
		await registerPaymentCardMutation.mutateAsync({
			...data,
			cardNumber: data.cardNumber.join(''),
		});
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
										/>
									);
								}
								// 유효기간
								if (name === 'cardExpirationMonth') {
									return (
										<CardExpirationInput
											key={`payment_input_card_${idx}`}
											inputs={
												input as AddPaymentCardInput[]
											}
											control={control}
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
}: {
	inputs: AddPaymentCardInput[];
	control: Control<any, any>;
	fields: FieldArrayWithId<RegisterCardForm, 'cardNumber', 'id'>[];
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
						<>
							<ControlledInputComponent
								key={`cardNumber.cardNumber${idx}`}
								name={`cardNumber[${idx}].value`}
								type={fieldInput['type'] as string}
								control={control}
								onChange={onChangeOnlyNumber}
								{...restFieldInput}
							/>
						</>
					);
				})}
			</Stack>
		</Stack>
	);
};

const CardExpirationInput = ({
	inputs,
	control,
}: {
	inputs: AddPaymentCardInput[];
	control: Control<any, any>;
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
								key={`card_expiration_input_${idx}`}
								type={item.type as string}
								name={item.name as string}
								control={control}
								onChange={onChangeOnlyNumber}
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
