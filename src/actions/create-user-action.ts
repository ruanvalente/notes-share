"use server";

import { redirect } from "next/navigation";

export async function createUserAction(formData: FormData) {
	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const confirmPassword = formData.get("confirmPassword") as string;

	// Validação básica
	if (!name || !email || !password || !confirmPassword) {
		redirect("/register?error=Email e senha são obrigatórios");
	}
	if (password !== confirmPassword) {
		redirect("/register?error=As senhas não coincidem");
	}

	// TODO: Implementar lógica de cadastro real (ex.: salvar no banco de dados)
	console.log("Registrando usuário:", {
		name,
		email,
		password,
		confirmPassword,
	});

	// Simulação de cadastro bem-sucedido
	redirect("/dashboard");
}
