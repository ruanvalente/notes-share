"use server";

import { LOGOUT_ERROR_MESSAGES } from "@/utils/constants/messages";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function logoutUserAction() {
	const supabase = await createClient();

	const { error } = await supabase.auth.signOut();

	if (error) {
		console.error(`${LOGOUT_ERROR_MESSAGES.FAILED_LOGOUT}:`, error.message);
		return {
			error: `${LOGOUT_ERROR_MESSAGES.FAILED_LOGOUT}`,
		};
	}

	redirect("/");
}
