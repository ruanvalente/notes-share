"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function updatePasswordAction(formData: FormData) {
	const newPassword = formData.get("newPassword") as string;
	const newPasswordConfirm = formData.get("newPasswordConfirm") as string;

	if (process.env.NODE_ENV === "development") {
		console.log("Received Form Data:", { newPassword, newPasswordConfirm });
	}

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
	// Verify session
	const {
		data: { session },
		error: sessionError,
	} = await supabase.auth.getSession();
	if (sessionError || !session) {
		if (process.env.NODE_ENV === "development") {
			console.log(
				"Session Error:",
				sessionError?.message || "No session found"
			);
		}
		redirect(
			`/reset-password?error=${encodeURIComponent(
				"Sessão inválida ou expirada. Tente iniciar o processo de recuperação novamente."
			)}`
		);
	}

	const { error } = await supabase.auth.updateUser({ password: newPassword });

	if (error) {
		if (process.env.NODE_ENV === "development") {
			console.log("Update User Error:", error.message);
		}
		redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
	}

	redirect(
		`/login?success=${encodeURIComponent(
			"Senha redefinida com sucesso! Faça login com sua nova senha."
		)}`
	);
}
