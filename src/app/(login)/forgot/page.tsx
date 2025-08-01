"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { resetPasswordAction } from "@/actions/";
import Link from "next/link";

export default function ForgotPasswordPage() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");
	const success = searchParams.get("success");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (formData: FormData) => {
		setIsLoading(true);
		try {
			await resetPasswordAction(formData);
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
					<CardTitle>Recuperar Senha</CardTitle>
					<CardDescription>
						Insira seu e-mail para receber um link de redefinição de senha.
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
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								name="email"
								placeholder="seu@email.com"
								required
							/>
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Enviando..." : "Enviar Link de Redefinição"}
						</Button>
					</form>
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Voltar para{" "}
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
