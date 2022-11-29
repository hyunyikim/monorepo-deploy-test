export const passwordFormat = /^(?=.*\d)(?=.*[!@#$%^&])(?=.*[a-zA-Z]).{8,}$/;
export const phoneNumberFormat = /^01[0179]-([0-9]{3,4})-([0-9]{4})$/;
export const emailFormat =
	/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

export const businessNumberFormat = /^[0-9]{3}-([0-9]{2})-([0-9]{5})$/;
export const dateFormat = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
