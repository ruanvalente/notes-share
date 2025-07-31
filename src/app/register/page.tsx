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
import { createUserAction } from "@/actions";

function RegisterContent() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");
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
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Já tem uma conta?{" "}
							<Link href="/login" className="text-blue-600 hover:underline">
								Entrar
							</Link>
						</p>
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
