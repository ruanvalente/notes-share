"use server";

import { CREATE_USER_ERROR_MESSAGES } from "@/utils/constants/messages";
import { createClient } from "@/utils/supabase/server";
import {
	checkArePasswordsMatching,
	checkIsValidEmail,
	checkIsValidName,
	checkIsValidPassword,
	handleSanitizedName,
} from "@/utils/validations";
import { redirect } from "next/navigation";

export async function createUserAction(formData: FormData) {
	const name = (formData.get("name") as string)?.trim();
	const email = (formData.get("email") as string)?.trim();
	const password = formData.get("password") as string;
	const confirmPassword = formData.get("confirmPassword") as string;

	if (!name || !email || !password || !confirmPassword) {
		redirect(
			`/register?error=${encodeURIComponent(
				CREATE_USER_ERROR_MESSAGES.REQUIRED_FIELDS
			)}`
		);
	}

	if (!checkIsValidEmail(email)) {
		redirect(
			`/register?error=${encodeURIComponent(
				CREATE_USER_ERROR_MESSAGES.INVALID_EMAIL
			)}`
		);
	}

	if (!checkIsValidPassword(password)) {
		redirect(
			`/register?error=${encodeURIComponent(
				CREATE_USER_ERROR_MESSAGES.INVALID_PASSWORD
			)}`
		);
	}

	const arePasswordsMatching = checkArePasswordsMatching(
		password,
		confirmPassword
	);
	if (!arePasswordsMatching) {
		redirect(
			`/register?error=${encodeURIComponent(
				CREATE_USER_ERROR_MESSAGES.PASSWORDS_NOT_MATCHING
			)}`
		);
	}

	const isValidName = checkIsValidName(name);
	if (!isValidName && (name.length < 2 || name.length > 255)) {
		redirect(
			`/register?error=${encodeURIComponent(
				CREATE_USER_ERROR_MESSAGES.INVALID_NAME
			)}`
		);
	}

	const sanitizedName = handleSanitizedName(name);
	const supabase = await createClient();

	const { error: signUpError } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: { full_name: sanitizedName },
			emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
		},
	});

	if (signUpError) {
		let errorMessage = CREATE_USER_ERROR_MESSAGES.FAILED_CREATE_ACCOUNT;
		if (signUpError.message.includes("User already registered")) {
			errorMessage = CREATE_USER_ERROR_MESSAGES.ACCOUNT_ALREADY_EXISTS;
		} else if (signUpError.message.includes("Database error saving new user")) {
			errorMessage = CREATE_USER_ERROR_MESSAGES.DATABASE_ERROR;
		}
		redirect(`/register?error=${encodeURIComponent(errorMessage)}`);
	}

	redirect(
		`/register?success=${encodeURIComponent(
			`${CREATE_USER_ERROR_MESSAGES.CREATE_ACCOUNT_SUCCESS}`
		)}`
	);
}
