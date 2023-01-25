import {InputProps, Stack, Typography} from '@mui/material';
import {Control, useForm} from 'react-hook-form';

import {
	Dialog,
	Button,
	InputWithLabel,
	InputLabelTag,
	ControlledInputComponent,
} from '@/components';

// TODO: 타입 정리

type AddPaymentCard = {
	customerKey: string;
	cardNumber: string;
	cardExpirationYear: string;
	cardExpirationMonth: string;
	cardPassword: string;
	customerIdentityNumber: string;
	email: string;
};

type AddPaymentCardInput = Partial<Omit<InputProps, 'error'>> & {
	label?: string;
	desc?: string;
};

type AddPaymentCardInputList = AddPaymentCardInput | AddPaymentCardInput[];

const inputList: AddPaymentCardInputList[] = [
	{
		type: 'hidden',
		name: 'customerKey',
		required: true,
	},
	{
		type: 'password',
		name: 'cardNumber',
		placeholder: new Array(4)
			.fill(new Array(4).fill('●').join(''))
			.join(' '),
		label: '카드번호',
		autoComplete: 'off',
		required: true,
		inputProps: {
			maxLength: 16,
		},
		className: 'password-mark',
	},
	[
		{
			type: 'password',
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
			type: 'password',
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
	},
	{
		type: 'text',
		name: 'email',
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
}

function AddPaymentCardModal({open, onClose}: Props) {
	const {control, getValues, watch} = useForm<AddPaymentCard>({
		defaultValues: {
			customerKey: '',
			cardNumber: '',
			cardExpirationYear: '',
			cardExpirationMonth: '',
			cardPassword: '',
			customerIdentityNumber: '',
			email: '',
		},
	});

	return (
		<Dialog
			open={open}
			showCloseButton={true}
			useBackgroundClickClose={true}
			onClose={onClose}
			TitleComponent={
				<Typography variant="header1" fontWeight="bold">
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
					<Button height={32}>확인</Button>
				</Stack>
			}>
			<Stack>
				<form noValidate>
					{inputList.map(
						(
							input: AddPaymentCardInput | AddPaymentCardInput[]
						) => {
							// 유효기간
							if ((input as AddPaymentCardInput[])?.length > 1) {
								return (
									<CardExpirationInput
										inputs={input as AddPaymentCardInput[]}
										control={control}
									/>
								);
							}
							const {type, name, label} =
								input as AddPaymentCardInput;
							if (type === 'hidden') {
								return null;
							}
							return (
								<InputWithLabel
									key={name}
									type={type as string}
									name={name as string}
									labelTitle={label as string}
									showRequiredChip={false}
									control={control}
									// TODO: 에러 메시지 추가
									// {...(error && {
									// 	...error,
									// })}
									{...input}
								/>
							);
						}
					)}
				</form>
			</Stack>
		</Dialog>
	);
}

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
				{inputs.map((item) => {
					return (
						<>
							<ControlledInputComponent
								key={item.name}
								type={item.type as string}
								name={item.name as string}
								control={control}
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
