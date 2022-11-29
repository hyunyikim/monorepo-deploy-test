import * as yup from 'yup';

export const productRegisterSchemaShape = yup.object().shape({
	name: yup.string().required('상품명을 입력해주세요.'),
	code: yup.string(),
	categoryCode: yup.string(),
	categoryName: yup.string(),
	brandIdx: yup.string().required('브랜드를 입력해주세요.'),
	modelNum: yup.string(),
	material: yup.string(),
	size: yup.string(),
	weight: yup.string(),
	price: yup.string().min(0),
	warranty: yup.string().required('보증기간을 입력해주세요.'),
});
