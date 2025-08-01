"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function updatePasswordAction(formData: FormData) {
	const newPassword = formData.get("newPassword") as string;
	const newPasswordConfirm = formData.get("newPasswordConfirm") as string;

	if (!newPassword || !newPasswordConfirm) {
		redirect(
			`/reset-password?error=${encodeURIComponent(
				"Ambas as senhas são obrigatórias"
			)}`
		);
	}

	if (newPassword !== newPasswordConfirm) {
		redirect(
			`/reset-password?error=${encodeURIComponent("As senhas não coincidem")}`
		);
	}

	if (newPassword.length < 6) {
		redirect(
			`/reset-password?error=${encodeURIComponent(
				"A senha deve ter pelo menos 6 caracteres"
			)}`
		);
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.updateUser(
		{ password: newPassword },
		{
			emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?type=recovery`,
		}
	);

	if (error) {
		redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
	}

	redirect(
		`/login?success=${encodeURIComponent(
			"Senha redefinida com sucesso! Faça login com sua nova senha."
		)}`
	);
}
