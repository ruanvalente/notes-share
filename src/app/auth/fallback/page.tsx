"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function SessionExpiredContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [countdown, setCountdown] = useState(15);
	const messageRef = useRef<HTMLDivElement>(null);
	const error = searchParams.get("error");

	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		if (countdown <= 0) {
			clearInterval(timer);
			router.push("/auth/login");
		}

		return () => clearInterval(timer);
	}, [router, countdown]);

	useEffect(() => {
		if (messageRef.current) {
			messageRef.current.focus();
		}
	}, []);

	const handleLogin = () => {
		router.push("/auth/login");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
					<AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
					<div
						className="text-center space-y-2"
						role="alert"
						aria-live="assertive"
					>
						<h2 className="text-xl font-semibold text-gray-900">
							Sessão Expirada
						</h2>
						<p
							className="text-sm text-gray-600 font-medium"
							ref={messageRef}
							tabIndex={-1}
						>
							{error
								? `Erro: ${decodeURIComponent(
										error
								  )}. Você será redirecionado para a tela de login em ${countdown} segundos.`
								: `Sua sessão expirou. Você será redirecionado para a tela de login em ${countdown} segundos.`}
						</p>
						{error && (
							<Alert className="mt-4" variant="destructive">
								<AlertDescription>{decodeURIComponent(error)}</AlertDescription>
							</Alert>
						)}
					</div>
					<Button
						onClick={handleLogin}
						className="bg-zinc-900 hover:bg-zinc-700 hover:cursor-pointer text-white"
					>
						Ir para Login Agora
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}

export default function SessionExpiredPage() {
	return (
		<Suspense>
			<SessionExpiredContent />
		</Suspense>
	);
}
