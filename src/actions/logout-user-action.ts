"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LOGOUT_ERROR_MESSAGES } from "@/utils/constants/messages";

export async function logoutUserAction(): Promise<void> {
	const supabase = await createClient();
	const { error } = await supabase.auth.signOut();

	if (error) {
		console.error(`${LOGOUT_ERROR_MESSAGES.FAILED_LOGOUT}:`, error.message);
		redirect(
			`/auth/login?error=${encodeURIComponent(
				LOGOUT_ERROR_MESSAGES.FAILED_LOGOUT
			)}`
		);
	}

	redirect("/auth/login");
}
