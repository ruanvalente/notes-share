import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FileText, Share2, Lock } from "lucide-react";

export default function HomeTemplatePage() {
	return (
		<div>
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
				{/* Header */}
				<header className="border-b bg-white/80 backdrop-blur-sm">
					<div className="container mx-auto px-4 py-4 flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<FileText className="h-8 w-8 text-blue-600" />
							<h1 className="text-2xl font-bold text-gray-900">NotesShare</h1>
						</div>
						<div className="flex items-center space-x-4">
							<Link href="/login">
								<Button className="hover:cursor-pointer" variant="ghost">
									Entrar
								</Button>
							</Link>
							<Link href="/register">
								<Button className="hover:cursor-pointer">Cadastrar</Button>
							</Link>
						</div>
					</div>
				</header>

				{/* Hero Section */}
				<section className="container mx-auto px-4 py-20 text-center">
					<h2 className="text-5xl font-bold text-gray-900 mb-6">
						Suas anotações, organizadas e compartilháveis
					</h2>
					<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
						Crie, organize e compartilhe suas anotações pessoais de forma
						segura. Mantenha suas ideias privadas ou compartilhe com o mundo.
					</p>
					<div className="flex items-center justify-center space-x-4">
						<Link href="/register">
							<Button size="lg" className="px-8 hover:cursor-pointer">
								Começar Gratuitamente
							</Button>
						</Link>
						<Link href="/demo">
							<Button
								variant="outline"
								size="lg"
								className="px-8 bg-transparent hover:cursor-pointer hover:border-zinc-950 transition-all duration-300"
							>
								Ver Demo
							</Button>
						</Link>
					</div>
				</section>

				{/* Features */}
				<section className="container mx-auto px-4 py-16">
					<div className="grid gap-8 text-center md:grid-cols-3 md:text-start">
						<Card className="hover:cursor-pointer hover:scale-105 transition-transform duration-300">
							<CardHeader>
								<FileText className="h-12 w-12 text-blue-600 mb-4 mx-auto md:mx-0" />
								<CardTitle>Anotações Organizadas</CardTitle>
								<CardDescription>
									Crie e organize suas anotações com títulos, tags e busca
									avançada
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="hover:cursor-pointer hover:scale-105 transition-transform duration-300">
							<CardHeader>
								<Share2 className="h-12 w-12 text-green-600 mb-4 mx-auto md:mx-0" />
								<CardTitle>Compartilhamento Fácil</CardTitle>
								<CardDescription>
									Compartilhe suas anotações públicas através de links únicos
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="hover:cursor-pointer hover:scale-105 transition-transform duration-300">
							<CardHeader>
								<Lock className="h-12 w-12 text-purple-600 mb-4 mx-auto md:mx-0" />
								<CardTitle>Privacidade Garantida</CardTitle>
								<CardDescription>
									Controle total sobre quais anotações são privadas ou públicas
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</section>
			</div>
		</div>
	);
}
