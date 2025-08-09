"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useTransition, useCallback } from "react";
import { FileText, Loader2Icon } from "lucide-react";

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

import { createUserAction } from "@/actions/create-user-action";
import { useToast } from "@/hooks/use-toast";

export function RegisterContent() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");
	const success = searchParams.get("success");
	const formFields = [
		{
			id: "name",
			label: "Nome completo",
			type: "text",
			placeholder: "Seu nome",
		},
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
		{
			id: "confirmPassword",
			label: "Confirmar senha",
			type: "password",
			placeholder: "••••••••",
		},
	];
	const [isPending, startTransition] = useTransition();
	const { toastError, toastSuccess } = useToast();

	useEffect(() => {
		if (success) toastSuccess(decodeURIComponent(success));
		if (error) toastError(decodeURIComponent(error));
	}, [success, error, toastSuccess, toastError]);

	const handleRegisterUser = useCallback((formData: FormData) => {
		startTransition(() => {
			createUserAction(formData);
		});
	}, []);

	const renderMessage = (message: string | null, type: "error" | "success") =>
		message && (
			<div
				className={`mb-4 text-sm text-center ${
					type === "error" ? "text-red-600" : "text-green-600"
				}`}
			>
				{decodeURIComponent(message)}
			</div>
		);

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
					{renderMessage(error, "error")}
					{renderMessage(success, "success")}

					<form action={handleRegisterUser} className="space-y-4">
						{formFields.map(({ id, label, type, placeholder }) => (
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
								{isPending && <Loader2Icon className="animate-spin" />}
								<span>{isPending ? "Cadastrando..." : "Cadastrar"}</span>
							</span>
						</Button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Já tem uma conta?{" "}
							<Link
								prefetch
								href="/auth/login"
								className="text-blue-600 hover:underline"
							>
								Entrar
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
