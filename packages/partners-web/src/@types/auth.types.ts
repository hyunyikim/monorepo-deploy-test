export interface SignInRequestRequestParam {
	email: string;
	password: string;
}

export interface SignInResponse {
	token: string;
}

export interface SignUpRequestFormData {
	email: string;
	companyName: string;
	password: string;
	phoneNum: string;
	businessNum: string;

	// cafe24로 가입했는지 여부
	cafe24Code?: string;
	cafe24State?: string;
}

// TODO: partnership 정보 조회와 응답 동일한지 확인 필요
export interface SignUpResponse {
	idx: number;
	adminType: string;
	email: string;
	name: string;
	phoneNum: string;
	companyName: string;
	businessNum: string;
	b2bType: string;
	profileImage: string;
	authInfo: string;
	returnInfo: string;
	afterServiceInfo: string;
	customerCenterUrl: string;
	category: string[];
	useFieldModelNum: string;
	useFieldMaterial: string;
	useFieldSize: string;
	useFieldWeight: string;
	warrantyDate: string;
	brand: SignUpResponseBrand;
}

// TODO: product의 brand와 동일한지 확인 필요
export interface SignUpResponseBrand {
	idx: number;
	name: string;
	englishName: string;
}
