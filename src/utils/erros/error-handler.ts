import { ErrorResponseOptions } from "@/utils/types/note-types";

export function handleError(
	error: ErrorResponseOptions,
	operation: string
): never {
	let errorMessage = `Erro ao ${operation}. `;

	if (error?.message) {
		errorMessage += error.message;
	} else if (error?.error_description) {
		errorMessage += error.error_description;
	} else {
		errorMessage += "Tente novamente mais tarde.";
	}

	throw new Error(errorMessage);
}
