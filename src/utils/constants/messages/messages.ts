export const LOGIN_ERROR_MESSAGES = {
	AUTOMATIC_LOGIN_FAILED:
		"Erro ao fazer login automático. Tente fazer login manualmente.",
	REQUIRED_FIELDS: "Preencha todos os campos obrigatórios",
	INVALID_EMAIL: "E-mail inválido",
	AUTHENTICATION_FAILED: "E-mail ou senha incorretos",
	EMAIL_NOT_CONFIRMED: "Confirme seu e-mail antes de fazer login",
	GENERIC_ERROR: "Erro inesperado. Tente novamente ou contate o suporte.",
	FAILED_LOGIN: "Erro ao fazer login. Tente novamente.",
};

export const LOGOUT_ERROR_MESSAGES = {
	GENERIC_ERROR: "Erro inesperado. Tente novamente ou contate o suporte.",
	FAILED_LOGOUT: "Erro ao fazer logout. Tente novamente.",
};

export const CREATE_USER_ERROR_MESSAGES = {
	INVALID_EMAIL: "E-mail inválido",
	INVALID_PASSWORD:
		"A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais",
	PASSWORDS_NOT_MATCHING: "As senhas não coincidem",
	INVALID_NAME:
		"O nome deve ter pelo menos 2 caracteres e no máximo 255 caracteres",
	ACCOUNT_ALREADY_EXISTS: "Este e-mail já está cadastrado",
	DATABASE_ERROR:
		"Erro interno no servidor. Por favor, tente novamente mais tarde.",
	FAILED_CREATE_ACCOUNT: "Erro ao criar a conta. Tente novamente.",
	GENERIC_ERROR: "Erro inesperado. Tente novamente ou contate o suporte.",
	REQUIRED_FIELDS: "Preencha todos os campos obrigatórios",
	CREATE_ACCOUNT_SUCCESS:
		"Link de confirmação enviado para o seu e-mail! Verifique sua caixa de entrada ou spam.",
};

export const RESET_PASSWORD_MESSAGES = {
	INVALID_EMAIL: "E-mail inválido",
	EMAIL_NOT_REGISTERED: "Este e-mail não está cadastrado",
	FAILED_SEND_RESET_LINK:
		"Erro ao enviar o link de redefinição. Tente novamente.",
	GENERIC_ERROR: "Erro inesperado. Tente novamente ou contate o suporte.",
	SUCCESS_RESET_LINK_SENT:
		"Link de redefinição enviado! Verifique sua caixa de entrada ou spam.",
	REQUIRED_FIELDS: "O campo de e-mail é obrigatório",
};
