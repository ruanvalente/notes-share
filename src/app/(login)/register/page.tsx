"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { createUserAction } from "@/actions/auth/create-user-action";

function RegisterContent() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");
	const success = searchParams.get("success");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (formData: FormData) => {
		setIsLoading(true);
		try {
			await createUserAction(formData);
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
					<CardTitle>Criar nova conta</CardTitle>
					<CardDescription>
						Cadastre-se para começar a criar suas anotações
					</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<div className="mb-4 text-red-600 text-sm text-center">
							{decodeURIComponent(error)}
						</div>
					)}
					{success && (
						<div className="mb-4 text-green-600 text-sm text-center">
							{decodeURIComponent(success)}
						</div>
					)}
					<form action={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Nome completo</Label>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="Seu nome"
								required
							/>
						</div>
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
						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirmar senha</Label>
							<Input
								id="confirmPassword"
								type="password"
								name="confirmPassword"
								placeholder="••••••••"
								required
							/>
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Cadastrando..." : "Cadastrar"}
						</Button>
					</form>

					<div className="mt-6 space-y-3">
						<div className="text-center">
							<p className="text-sm text-gray-600">
								Já tem uma conta?{" "}
								<Link
									href="/login"
									className="text-blue-600 hover:underline font-medium"
								>
									Entrar
								</Link>
							</p>
						</div>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-gray-200" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-2 text-gray-500">ou</span>
							</div>
						</div>

						<div className="text-center">
							<p className="text-sm text-gray-600">
								Perdeu a sua conta?{" "}
								<Link
									href="/forgot"
									prefetch
									className="text-blue-600 hover:underline font-medium"
								>
									Recuperar a conta
								</Link>
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function RegisterPage() {
	return (
		<Suspense fallback={<div>Carregando...</div>}>
			<RegisterContent />
		</Suspense>
	);
}
