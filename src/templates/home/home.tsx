import { logoutUserAction } from "@/actions";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { PageTransitionWrapper } from "@/components/wrappers/page-transition";
import { getCurrentUser, isAuthenticated } from "@/lib/supabase/auth";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { FileText, Lock, LogOut, Menu, Share2, User } from "lucide-react";
import Link from "next/link";

export default async function HomeTemplatePage() {
	const userAuthenticated = await isAuthenticated();
	const user = userAuthenticated ? await getCurrentUser() : null;
	const userName =
		userAuthenticated && user ? user.user_metadata.full_name : null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<header className="border-b bg-white/80 backdrop-blur-sm">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<FileText className="h-8 w-8 text-blue-600" />
						<h1 className="text-xl sm:text-2xl font-bold text-gray-900">
							NotesShare
						</h1>
					</div>

					{userAuthenticated && user ? (
						<>
							<div className="hidden md:flex items-center space-x-4">
								<Button
									variant="ghost"
									size="sm"
									disabled
									className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
								>
									<User className="h-5 w-5" />
									<span className="truncate max-w-[120px]">{userName}</span>
								</Button>
								<form action={logoutUserAction}>
									<Button
										type="submit"
										variant="ghost"
										size="sm"
										className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors hover:cursor-pointer"
									>
										<LogOut className="h-5 w-5" />
										<span>Sair</span>
									</Button>
								</form>
							</div>

							<div className="md:hidden">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
										>
											<Menu className="h-5 w-5" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-56 bg-white shadow rounded-md p-1"
									>
										<DropdownMenuItem
											disabled
											className="flex items-center space-x-2 px-2"
										>
											<User className="h-4 w-4" />
											<span className="truncate">{userName}</span>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem asChild>
											<form action={logoutUserAction} className="w-full">
												<Button
													type="submit"
													variant="ghost"
													size="sm"
													className="w-full justify-start flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors h-auto p-2"
												>
													<LogOut className="h-4 w-4" />
													<span>Sair</span>
												</Button>
											</form>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</>
					) : (
						<div className="flex items-center space-x-2 sm:space-x-4">
							<Link prefetch href="/auth/login">
								<Button className="hover:cursor-pointer" variant="ghost">
									Entrar
								</Button>
							</Link>
							<Link href="/auth/register" prefetch>
								<Button className="hover:cursor-pointer">Cadastrar</Button>
							</Link>
						</div>
					)}
				</div>
			</header>

			<PageTransitionWrapper>
				<section className="container mx-auto px-4 py-16 sm:py-20 text-center">
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
						Suas anotações, organizadas e compartilháveis
					</h2>
					<p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
						Crie, organize e compartilhe suas anotações pessoais de forma
						segura. Mantenha suas ideias privadas ou compartilhe com o mundo.
					</p>
					{userAuthenticated && user ? (
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<Link prefetch href="/dashboard">
								<Button
									size="lg"
									className="px-8 hover:cursor-pointer w-full sm:w-auto"
								>
									Ir para Dashboard
								</Button>
							</Link>
						</div>
					) : (
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<Link prefetch href="/auth/register">
								<Button
									size="lg"
									className="px-8 hover:cursor-pointer w-full sm:w-auto"
								>
									Começar Gratuitamente
								</Button>
							</Link>
							<Link href="/demo" prefetch>
								<Button
									variant="outline"
									size="lg"
									className="px-8 bg-transparent hover:cursor-pointer hover:border-zinc-950 transition-all duration-300 w-full sm:w-auto"
									disabled
								>
									Ver Demo
								</Button>
							</Link>
						</div>
					)}
				</section>

				<section className="container mx-auto px-4 py-16">
					<div className="grid gap-8 text-center sm:grid-cols-2 md:grid-cols-3 sm:text-start">
						<Card className="hover:cursor-pointer hover:scale-105 transition-transform duration-300">
							<CardHeader>
								<FileText className="h-12 w-12 text-blue-600 mb-4 mx-auto sm:mx-0" />
								<CardTitle>Anotações Organizadas</CardTitle>
								<CardDescription>
									Crie e organize suas anotações com títulos, tags e busca
									avançada
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="hover:cursor-pointer hover:scale-105 transition-transform duration-300">
							<CardHeader>
								<Share2 className="h-12 w-12 text-green-600 mb-4 mx-auto sm:mx-0" />
								<CardTitle>Compartilhamento Fácil</CardTitle>
								<CardDescription>
									Compartilhe suas anotações públicas através de links únicos
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="hover:cursor-pointer hover:scale-105 transition-transform duration-300">
							<CardHeader>
								<Lock className="h-12 w-12 text-purple-600 mb-4 mx-auto sm:mx-0" />
								<CardTitle>Privacidade Garantida</CardTitle>
								<CardDescription>
									Controle total sobre quais anotações são privadas ou públicas
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</section>
			</PageTransitionWrapper>
		</div>
	);
}
