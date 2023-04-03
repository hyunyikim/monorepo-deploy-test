import * as yup from 'yup';

import {dateFormat, phoneNumberFormat} from '@/utils/regex.util';

export const brandGuaranteeSchemaShape = yup.object().shape({
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

export const cooperatorGuaranteeSchemaShape = yup.object().shape({
	brandName: yup.string(),
	brandNameEN: yup.string(),
	warrantyDate: yup.string().required('보증기간을 입력해주세요.'),
	serviceCenter: yup.string(),
	authInfo: yup.string(),
	returnInfo: yup.string(),
	afterServiceInfo: yup.string(),
});

export const guaranteeRegisterSchemaShape = yup.object().shape({
	ordererName: yup.string().required('이름을 입력해주세요.'),
	ordererTel: yup
		.string()
		.required('고객 연락처를 정확히 입력해주세요.')
		.matches(phoneNumberFormat, '고객 연락처를 정확히 입력해주세요.'),
	orderedAt: yup.string().test({
		message: '주문일자 형식을 확인해주세요.',
		test: (value) => {
			if (value) {
				return RegExp(dateFormat).test(value);
			}
			return true;
		},
	}),
});
