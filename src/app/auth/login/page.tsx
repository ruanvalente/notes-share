"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginUserAction } from "@/actions/login-user-action";
import { useToast } from "@/hooks/use-toast";

export default function LoginContent() {
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const { toastError } = useToast();
	const fields = [
		{
			id: "email",
			label: "Email",
			type: "email",
			placeholder: "seu@email.com",
		},
		{
			id: "password",
			label: "Senha",
			type: "password",
			placeholder: "••••••••",
		},
	];
	const handleSignIn = async (formData: FormData) => {
		setError(null);
		startTransition(async () => {
			const result = await loginUserAction(formData);
			if (result?.error) {
				setError(result.error);
				toastError(result.error);
			}
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="flex items-center justify-center mb-4">
						<FileText className="h-8 w-8 text-blue-600" />
						<h1 className="text-2xl font-bold text-gray-900 ml-2">
							NotesShare
						</h1>
					</div>
					<CardTitle>Entrar na sua conta</CardTitle>
					<CardDescription>
						Digite suas credenciais para acessar suas anotações
					</CardDescription>
				</CardHeader>

				<CardContent>
					{error && (
						<div className="mb-4 text-red-600 text-sm text-center">{error}</div>
					)}

					<form action={handleSignIn} className="space-y-4">
						{fields.map(({ id, label, type, placeholder }) => (
							<div key={id} className="space-y-2">
								<Label htmlFor={id}>{label}</Label>
								<Input
									id={id}
									name={id}
									type={type}
									placeholder={placeholder}
									required
								/>
							</div>
						))}

						<Button type="submit" className="w-full" disabled={isPending}>
							<span className="flex items-center justify-center gap-2">
								{isPending && <Loader2 className="animate-spin w-4 h-4" />}
								{isPending ? "Entrando..." : "Entrar"}
							</span>
						</Button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Não tem uma conta?{" "}
							<Link
								prefetch
								href="/auth/register"
								className="text-blue-600 hover:underline"
							>
								Cadastre-se
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
