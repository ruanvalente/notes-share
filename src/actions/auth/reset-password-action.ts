"use server";

import { RESET_PASSWORD_MESSAGES } from "@/utils/constants/messages";
import { createClient } from "@/utils/supabase/server";
import { checkIsValidEmail } from "@/utils/validations";
import { redirect } from "next/navigation";

export async function resetPasswordAction(formData: FormData) {
	const email = (formData.get("email") as string)?.trim();

	if (!checkIsValidEmail(email)) {
		redirect(
			`/forgot?error=${encodeURIComponent(
				`${RESET_PASSWORD_MESSAGES.REQUIRED_FIELDS}`
			)}`
		);
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?type=recovery`,
	});

	if (error) {
		redirect(`/forgot?error=${encodeURIComponent(error.message)}`);
	}

	redirect(
		`/forgot?success=${encodeURIComponent(
			`${RESET_PASSWORD_MESSAGES.SUCCESS_RESET_LINK_SENT}`
		)}`
	);
}
