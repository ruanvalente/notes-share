"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Clock,
	Calendar,
	Share2,
	Copy,
	CheckCircle,
	Globe,
	Timer,
	FileText,
} from "lucide-react";
import type { PublicNote } from "@/utils/types/note-types";
import { formatDate } from "@/utils/date/format-date";

type Props = {
	note: PublicNote;
};

export default function ImprovedPublicNotePageClient({ note }: Props) {
	const [timeLeft, setTimeLeft] = useState<string>("");
	const [copied, setCopied] = useState(false);
	useEffect(() => {
		if (!note?.public_token_expires_at) return;

		const updateTimeLeft = () => {
			const now = new Date().getTime();
			const expiry = new Date(note?.public_token_expires_at).getTime();
			const difference = expiry - now;

			if (difference > 0) {
				const hours = Math.floor(difference / (1000 * 60 * 60));
				const minutes = Math.floor(
					(difference % (1000 * 60 * 60)) / (1000 * 60)
				);
				setTimeLeft(`${hours}h ${minutes}m`);
			} else {
				setTimeLeft("Expirado");
			}
		};

		updateTimeLeft();
		const interval = setInterval(updateTimeLeft, 60000);

		return () => clearInterval(interval);
	}, [note?.public_token_expires_at]);

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Erro ao copiar link:", err);
		}
	};

	const wordCount = note.content
		.split(/\s+/)
		.filter((word) => word.length > 0).length;
	const readingTime = Math.ceil(wordCount / 200);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="bg-white border-b border-gray-200 shadow-sm">
				<div className="max-w-4xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<Globe className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<h1 className="text-lg font-semibold text-gray-900">
									Nota Pública
								</h1>
								<p className="text-sm text-gray-500">Compartilhada com você</p>
							</div>
						</div>

						{note?.public_token_expires_at && (
							<div className="flex items-center space-x-2 text-sm">
								<Timer className="h-4 w-4 text-orange-500" />
								<span className="text-gray-600">Expira em:</span>
								<Badge
									variant={
										timeLeft === "Expirado" ? "destructive" : "secondary"
									}
								>
									{timeLeft}
								</Badge>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-4 py-8">
				<div className="grid gap-6">
					<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
						<CardHeader className="pb-4">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<CardTitle className="text-base md:text-2xl font-bold text-gray-900 mb-2">
										{note.title}
									</CardTitle>

									<div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
										<div className="flex items-center space-x-1">
											<Calendar className="h-4 w-4" />
											<span>
												Criada em {formatDate(note.created_at as string)}
											</span>
										</div>
										<div className="flex items-center space-x-1">
											<FileText className="h-4 w-4" />
											<span>{wordCount} palavras</span>
										</div>
										<div className="flex items-center space-x-1">
											<Clock className="h-4 w-4" />
											<span>{readingTime} min de leitura</span>
										</div>
									</div>
								</div>

								<Button
									variant="outline"
									size="sm"
									onClick={handleCopyLink}
									className="ml-4 bg-transparent"
								>
									{copied ? (
										<>
											<CheckCircle className="h-4 w-4 mr-2 text-green-600" />
											Copiado!
										</>
									) : (
										<>
											<Copy className="h-4 w-4 mr-2" />
											Copiar Link
										</>
									)}
								</Button>
							</div>
						</CardHeader>

						<CardContent className="space-y-6">
							{note.tags.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{note.tags.map((tag) => (
										<Badge
											key={tag}
											variant="secondary"
											className="bg-blue-100 text-blue-800 hover:bg-blue-200"
										>
											{tag}
										</Badge>
									))}
								</div>
							)}

							<div className="prose prose-gray max-w-none">
								<div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
									{note.content}
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Button
							variant="outline"
							onClick={handleCopyLink}
							className="flex items-center space-x-2 bg-transparent hover:cursor-pointer"
						>
							<Share2 className="h-4 w-4" />
							<span>Compartilhar Nota</span>
						</Button>

						<Link href="/auth/register">
							<Button className="w-full sm:w-auto hover:cursor-pointer">
								Criar Minha Conta
							</Button>
						</Link>
					</div>
					<div className="mt-12 py-8 border-t border-gray-200 bg-white/50">
						<div className="max-w-4xl mx-auto px-4 text-center">
							<p className="text-sm text-gray-500">
								Esta nota foi compartilhada usando nosso sistema de notas
								públicas.
							</p>
							<p className="text-xs text-gray-400 mt-1">
								Links públicos expiram automaticamente por segurança.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
