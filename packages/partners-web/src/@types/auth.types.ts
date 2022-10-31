export interface SignInRequest {
	email: string;
	password: string;
}

export interface SignInResponse {
	token: string;
}
