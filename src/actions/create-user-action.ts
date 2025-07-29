"use server";

import { redirect } from "next/navigation";

export async function createUserAction(formData: FormData) {
	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const confirmPassword = formData.get("confirmPassword") as string;

	if (!name || !email || !password || !confirmPassword) {
		redirect("/register?error=missing_fields");
	}
	if (password !== confirmPassword) {
		redirect("/register?error=password_mismatch");
	}

	console.log("Registrando usuário:", {
		name,
		email,
		password,
		confirmPassword,
	});

	redirect("/dashboard");
}
