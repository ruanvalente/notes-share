"use server";

import { RESET_PASSWORD_MESSAGES } from "@/utils/constants/messages";
import { createClient } from "@/utils/supabase/server";
import { checkIsValidEmail } from "@/utils/validations";
import { redirect } from "next/navigation";

export async function resetPasswordAction(formData: FormData) {
	const supabase = await createClient();
	const redirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?type=recovery`;

	const email = (formData.get("email") as string)?.trim();

	if (!checkIsValidEmail(email)) {
		redirect(
			`/forgot?error=${encodeURIComponent(
				`${RESET_PASSWORD_MESSAGES.REQUIRED_FIELDS}`
			)}`
		);
	}

	if (process.env.NODE_ENV === "development") {
		console.log("Reset Password RedirectTo:", redirectTo);
	}
	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo,
	});

	if (error) {
		if (process.env.NODE_ENV === "development") {
			console.log("Reset Password Error:", error.message);
		}
		redirect(`/forgot?error=${encodeURIComponent(error.message)}`);
	}

	redirect(
		`/forgot?success=${encodeURIComponent(
			`${RESET_PASSWORD_MESSAGES.SUCCESS_RESET_LINK_SENT}`
		)}`
	);
}
