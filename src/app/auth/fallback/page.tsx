"use client";

import { useEffect, useRef, useState, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2Icon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SessionExpiredContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [countdown, setCountdown] = useState(15);
	const [isPending, startTransition] = useTransition();
	const messageRef = useRef<HTMLDivElement>(null);
	const error = searchParams.get("error");

	const redirectToLogin = useCallback(() => {
		startTransition(() => {
			router.push("/auth/login");
		});
	}, [router]);

	useEffect(() => {
		if (countdown <= 0) {
			redirectToLogin();
			return;
		}
		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [countdown, redirectToLogin]);

	useEffect(() => {
		messageRef.current?.focus();
	}, []);

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
						onClick={redirectToLogin}
						className="bg-zinc-900 hover:bg-zinc-700 hover:cursor-pointer text-white"
						disabled={isPending}
					>
						<span className="flex items-center justify-center gap-2">
							{isPending && <Loader2Icon className="animate-spin" />}
							<span>
								{isPending ? "Redirecionando..." : "Ir para Login Agora"}
							</span>
						</span>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
