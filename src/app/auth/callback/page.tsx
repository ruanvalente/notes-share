"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createSupaseClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthCallback() {
	const router = useRouter();
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading"
	);
	const [message, setMessage] = useState("Verificando suas credenciais...");
	const messageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleCallback = async () => {
			try {
				setStatus("loading");
				setMessage("Verificando suas credenciais...");

				const supabase = createSupaseClient();
				const { data, error } = await supabase.auth.getSession();

				if (error) {
					setStatus("error");
					setMessage(
						error.message.includes("invalid")
							? "Sessão inválida ou expirada. Redirecionando para login..."
							: "Erro ao processar autenticação. Redirecionando para login..."
					);
					setTimeout(() => {
						router.push(`/login?error=${encodeURIComponent(error.message)}`);
					}, 2000);
					return;
				}

				if (!data.session) {
					setStatus("error");
					setMessage(
						"Nenhuma sessão ativa encontrada. Redirecionando para login..."
					);
					setTimeout(() => {
						router.push("/login?error=Nenhuma sessão ativa encontrada");
					}, 2000);
					return;
				}

				setStatus("success");
				setMessage("Autenticação realizada com sucesso! Redirecionando...");
				setTimeout(() => {
					router.push("/dashboard");
				}, 1500);
			} catch (err) {
				console.error("Erro ao processar callback de autenticação:", err);
				setStatus("error");
				setMessage("Erro inesperado. Redirecionando para login...");
				setTimeout(() => {
					router.push("/login?error=Erro inesperado");
				}, 2000);
			}
		};

		handleCallback();
	}, [router]);

	useEffect(() => {
		if (messageRef.current) {
			messageRef.current.focus();
		}
	}, [status, message]);

	const getIcon = () => {
		switch (status) {
			case "loading":
				return (
					<Loader2
						className="h-8 w-8 animate-spin text-blue-600"
						aria-hidden="true"
					/>
				);
			case "success":
				return (
					<CheckCircle className="h-8 w-8 text-green-600" aria-hidden="true" />
				);
			case "error":
				return (
					<AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
				);
		}
	};

	const getStatusColor = () => {
		switch (status) {
			case "loading":
				return "text-blue-600";
			case "success":
				return "text-green-600";
			case "error":
				return "text-red-600";
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
					<div className="flex items-center justify-center">{getIcon()}</div>

					<div
						className="text-center space-y-2"
						role="alert"
						aria-live="assertive"
					>
						<h2 className="text-xl font-semibold text-gray-900">
							{status === "loading" && "Autenticando..."}
							{status === "success" && "Sucesso!"}
							{status === "error" && "Ops!"}
						</h2>
						<p
							className={`text-sm ${getStatusColor()} font-medium`}
							ref={messageRef}
							tabIndex={-1}
						>
							{message}
						</p>
					</div>

					{status === "loading" && (
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-blue-600 h-2 rounded-full animate-[pulse_2s_infinite]"
								style={{ width: "100%" }}
							></div>
						</div>
					)}

					<div className="text-center">
						<p className="text-xs text-gray-500">
							{status === "loading" && "Por favor, aguarde alguns instantes..."}
							{status === "success" &&
								"Você será redirecionado automaticamente."}
							{status === "error" && (
								<>
									Você será redirecionado para tentar novamente.{" "}
									<Button
										variant="link"
										size="sm"
										className="text-blue-600 p-0"
										onClick={() => router.push("/login")}
									>
										Ir para login agora
									</Button>
								</>
							)}
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
