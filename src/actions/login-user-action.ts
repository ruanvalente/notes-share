"use server";

import { LOGIN_ERROR_MESSAGES } from "@/utils/constants/messages";
import { createClient } from "@/utils/supabase/server";
import { checkIsValidEmail } from "@/utils/validations";
import { redirect } from "next/navigation";

export async function loginUserAction(formData: FormData) {
	const email = (formData.get("email") as string)?.trim();
	const password = formData.get("password") as string;

	if (!email || !password) {
		return {
			error: `${LOGIN_ERROR_MESSAGES.REQUIRED_FIELDS}`,
		};
	}

	if (!checkIsValidEmail(email)) {
		return {
			error: `${LOGIN_ERROR_MESSAGES.INVALID_EMAIL}`,
		};
	}

	const supabase = await createClient();

	const { error: signInError } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (signInError) {
		let errorMessage = `${LOGIN_ERROR_MESSAGES.AUTOMATIC_LOGIN_FAILED}`;
		if (signInError.message.includes("Invalid login credentials")) {
			errorMessage = `${LOGIN_ERROR_MESSAGES.AUTHENTICATION_FAILED}`;
		} else if (signInError.message.includes("Email not confirmed")) {
			errorMessage = `${LOGIN_ERROR_MESSAGES.EMAIL_NOT_CONFIRMED}`;
		}
		return {
			error: errorMessage,
		};
	}

	redirect("/dashboard");
}
