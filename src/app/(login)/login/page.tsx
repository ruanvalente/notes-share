"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
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
import { FileText } from "lucide-react";
import { loginUserAction } from "@/actions/auth/login-user-action";

function LoginContent() {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (formData: FormData) => {
		setIsLoading(true);
		setError(null);
		try {
			const result = await loginUserAction(formData);
			if (result?.error) {
				setError(result.error);
			}
		} finally {
			setIsLoading(false);
		}
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
					<form action={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								name="email"
								placeholder="seu@email.com"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Senha</Label>
							<Input
								id="password"
								type="password"
								name="password"
								placeholder="••••••••"
								required
							/>
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Entrando..." : "Entrar"}
						</Button>
					</form>
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Não tem uma conta?{" "}
							<Link href="/register" className="text-blue-600 hover:underline">
								Cadastre-se
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={<div>Carregando...</div>}>
			<LoginContent />
		</Suspense>
	);
}
