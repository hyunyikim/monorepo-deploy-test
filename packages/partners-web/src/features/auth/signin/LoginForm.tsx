import {useCallback} from 'react';
import {useForm} from 'react-hook-form';

import {SignInRequest} from '@/@types/auth.types';
import {signIn} from '@/api/auth.api';
import {getPartnershipInfo} from '@/api/partnership.api';
import {
	useLoginStore,
	TOKEN_KEY,
	usePartnershipStore,
	useViewMenuStore,
	VIEW_MENU_KEY,
} from '@/stores';
import {matchViewMenu} from '@/data';

function LoginForm() {
	const {
		register,
		handleSubmit,
		watch,
		formState: {errors},
	} = useForm<SignInRequest>();

	const {isLogin, token, setLogin, setLogout} = useLoginStore(
		(state) => state
	);
	const {setData} = usePartnershipStore((state) => ({
		setData: state.setData,
	}));
	const setViewMenu = useViewMenuStore((state) => state.setViewMenu);

	const onSubmit = useCallback(async (data: SignInRequest) => {
		try {
			const res = await signIn(data);
			// const token = res.data.token;
			// localStorage.setItem(TOKEN_KEY, token);
			// setLogin(token);
			// const partnershipInfo = await getPartnershipInfo();
			// const partnershipData = partnershipInfo.data;
			// setData(partnershipData);
			// const viewMenu = {
			// 	useUnipass: partnershipData?.useUnipass ?? 'N',
			// 	useInspect: partnershipData?.useInspect ?? 'N',
			// 	useRepair: partnershipData?.useRepair ?? 'N',
			// };
			// setViewMenu(viewMenu);
			// localStorage.setItem(VIEW_MENU_KEY, JSON.stringify(viewMenu));
			// TODO:
			// window.location.replace('/');
		} catch (e) {
			console.log('e :>> ', e);
		}
	}, []);

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<input defaultValue={'vircle'} {...register('email')} />
				<input
					defaultValue={'mation0801!'}
					type="password"
					{...register('password')}
				/>
				<input type="submit" value="제출" />
			</form>
			<button onClick={setLogout}>logout</button>
			<br />
			isLogin: {isLogin ? 'true' : 'false'} <br />
			token : {token}
		</>
	);
}

export default LoginForm;
