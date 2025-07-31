const REGEX = {
	VALID_EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	VALID_PASSWORD:
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
	VALID_NAME: /^[a-zA-ZÀ-ÿ\s]{2,255}$/,
	SANITIZED_NAME: /[<>{}]/g,
};

export const checkIsValidEmail = (email: string): boolean => {
	return REGEX.VALID_EMAIL.test(email);
};
export const checkIsValidPassword = (password: string): boolean => {
	return REGEX.VALID_PASSWORD.test(password);
};
export const checkIsValidName = (name: string): boolean => {
	return REGEX.VALID_NAME.test(name);
};
export const checkArePasswordsMatching = (
	password: string,
	confirmPassword: string
): boolean => {
	return password === confirmPassword;
};

export const handleSanitizedName = (name: string): string => {
	return name.replace(REGEX.SANITIZED_NAME, "");
};
