import {AxiosError} from 'axios';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';

import {Stack, Typography} from '@mui/material';

import {passwordSchemaValidation} from '@/utils/schema';
import {changePassword} from '@/api/auth.api';
import {useMessageDialog} from '@/stores';

import {Button, InputWithLabel} from '@/components';
import {replaceToParentUrl} from '@/utils';

const inputList = [
	{
		type: 'password',
		name: 'curPassword',
		placeholder: '임시 비밀번호를 입력해주세요',
		label: '임시 비밀번호',
	},
	{
		type: 'password',
		name: 'newPassword',
		placeholder: '새 비밀번호를 입력해주세요',
		label: '새 비밀번호',
	},
	{
		type: 'password',
		name: 'newPasswordConfirm',
		placeholder: '새 비밀번호를 다시 입력해주세요',
		label: '새 비밀번호 확인',
	},
];

interface PasswordResetRequestForm {
	curPassword: string;
	newPassword: string;
	newPasswordConfirm: string;
}

const changePasswordShape = yup.object().shape({
	curPassword: yup.string().required('현재 비밀번호를 입력해주세요.'),
	newPassword: passwordSchemaValidation('새 비밀번호를 입력해주세요.'),
	newPasswordConfirm: passwordSchemaValidation(
		'새 비밀번호를 다시 한번 입력해주세요.'
	),
});

function PasswordReset() {
	const {
		handleSubmit,
		setError,
		control,
		watch,
		getValues,
		formState: {errors},
	} = useForm<PasswordResetRequestForm>({
		resolver: yupResolver(changePasswordShape),
		mode: 'onChange',
	});
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const onOpenError = useMessageDialog((state) => state.onOpenError);

	const onSubmit = async (data: PasswordResetRequestForm) => {
		try {
			const values = getValues();
			if (values.newPassword !== values.newPasswordConfirm) {
				setError('newPasswordConfirm', {
					type: 'manual',
					message: '새 비밀번호가 일치하지 않습니다.',
				});
				return;
			}
			if (values.curPassword === values.newPassword) {
				setError('newPassword', {
					type: 'manual',
					message: '기존 비밀번호와 다른 비밀번호를 입력해주세요.',
				});
				return;
			}

			await changePassword({
				curPassword: data.curPassword,
				newPassword: data.newPassword,
			});
			onOpenMessageDialog({
				title: '비밀번호가 변경됐습니다.',
				showBottomCloseButton: true,
				closeButtonValue: '확인',
				onCloseFunc: () => {
					replaceToParentUrl('/dashboard');
				},
			});
		} catch (e: unknown) {
			// 요청 파라미터가 잘못된 경우
			const statusCode = (e as AxiosError)?.response?.status;
			if (statusCode === 401) {
				setError('curPassword', {
					message: '비밀번호가 다릅니다.',
				});
				return;
			}
			onOpenError();
		}
	};

	const watchData = watch();

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			style={{
				width: '100%',
			}}>
			<Stack
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				width="100%"
				maxWidth="400px"
				height="100%"
				margin="auto">
				<Typography
					variant="header2"
					width="100%"
					mb="40px"
					textAlign="left">
					보안을 위해 비밀번호를 변경하세요.
				</Typography>
				{inputList.map((input) => {
					const {name} = input;
					return (
						<InputWithLabel
							key={name}
							name={name}
							control={control}
							labelTitle={input.label}
							placeholder={input.placeholder}
							inputType={input.type}
							error={
								errors[name as keyof PasswordResetRequestForm]
							}
						/>
					);
				})}
				<Button
					height={48}
					width="100%"
					type="submit"
					// 값이 하나라도 입력 되었다면 disabled false
					disabled={
						Object.values(watchData).some((value) => value)
							? false
							: true
					}
					sx={{
						marginTop: '24px',
					}}>
					비밀번호 바꾸기
				</Button>
				<Typography
					className="cursor-pointer underline"
					fontSize={16}
					color="grey.400"
					mt="24px"
					onClick={() => {
						replaceToParentUrl('/dashboard');
					}}>
					다음에 설정하기
				</Typography>
			</Stack>
		</form>
	);
}

export default PasswordReset;
