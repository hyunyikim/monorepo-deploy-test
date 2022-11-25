import * as yup from 'yup';

export const guaranteeSchemaShape = yup.object().shape({
	// brandName: yup.string().required(),
	// brandNameEN: yup.string().required(),
	brandName: yup.string().required('브랜드명(국문)을 입력해주세요.'),
	brandNameEN: yup.string().required('브랜드명(영문)을 입력해주세요.'),
	warrantyDate: yup.string().required('보증기간을 입력해주세요.'),
	serviceCenter: yup.string(),
	authInfo: yup.string(),
	returnInfo: yup.string(),
	afterServiceInfo: yup.string(),
});
