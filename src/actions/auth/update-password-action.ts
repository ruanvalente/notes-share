"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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

	try {
		const supabase = await createClient();

		// CORREÇÃO: Verificar os cookies para debug
		const cookieStore = await cookies();
		const authCookies = cookieStore
			.getAll()
			.filter(
				(cookie) =>
					cookie.name.includes("supabase") || cookie.name.includes("auth")
			);

		if (process.env.NODE_ENV === "development") {
			console.log(
				"Auth cookies:",
				authCookies.map((c) => ({ name: c.name, hasValue: !!c.value }))
			);
		}

		// CORREÇÃO: Usar refreshSession para garantir que a sessão está ativa
		const { data: refreshedSession, error: refreshError } =
			await supabase.auth.refreshSession();

		if (refreshError) {
			if (process.env.NODE_ENV === "development") {
				console.log("Refresh Session Error:", refreshError.message);
			}
		}

		// Verify session
		const {
			data: { session },
			error: sessionError,
		} = await supabase.auth.getSession();

		if (sessionError || !session) {
			if (process.env.NODE_ENV === "development") {
				console.log(
					"Session Error:",
					sessionError?.message || "No session found",
					"Session data:",
					session
				);
			}
			redirect(
				`/login?error=${encodeURIComponent(
					"Sessão expirada. Por favor, refaça o processo de recuperação de senha."
				)}`
			);
		}

		// CORREÇÃO: Verificar se o usuário tem permissão para alterar senha
		if (!session.user) {
			if (process.env.NODE_ENV === "development") {
				console.log("No user in session");
			}
			redirect(
				`/login?error=${encodeURIComponent(
					"Usuário não encontrado na sessão."
				)}`
			);
		}

		if (process.env.NODE_ENV === "development") {
			console.log("Valid session found for user:", session.user.email);
		}

		const { error } = await supabase.auth.updateUser({ password: newPassword });

		if (error) {
			if (process.env.NODE_ENV === "development") {
				console.log("Update User Error:", error.message);
			}

			// CORREÇÃO: Tratar diferentes tipos de erro
			if (error.message.includes("session")) {
				redirect(
					`/login?error=${encodeURIComponent(
						"Sessão expirada. Refaça o processo de recuperação de senha."
					)}`
				);
			}

			redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
		}

		// CORREÇÃO: Fazer logout após alteração de senha para forçar novo login
		await supabase.auth.signOut();

		redirect(
			`/login?success=${encodeURIComponent(
				"Senha redefinida com sucesso! Faça login com sua nova senha."
			)}`
		);
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.log("Unexpected error in updatePasswordAction:", error);
		}
		redirect(
			`/reset-password?error=${encodeURIComponent(
				"Erro inesperado. Tente novamente."
			)}`
		);
	}
}
