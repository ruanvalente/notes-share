import { Header } from "@/components/shared/header/header";
import Link from "next/link";

export default function DashboardPage() {
	return (
		<>
			<Header />
			<section className="container mx-auto px-4 py-20 text-center">
				<h2 className="text-5xl font-bold text-gray-900 mb-6">
					Bem-vindo ao seu painel de anotações
				</h2>
				<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
					Gerencie suas anotações, organize-as em categorias e compartilhe com
					seus amigos.
				</p>
			</section>
			<section className="container mx-auto px-4 py-20">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<div className="bg-white shadow-md rounded-lg p-6">
						<h3 className="text-xl font-semibold text-gray-900 mb-4">
							Criar Anotação
						</h3>
						<p className="text-gray-600 mb-4">
							Clique aqui para criar uma nova anotação e comece a escrever suas
							ideias.
						</p>
						<Link
							href="/notes/create"
							className="text-blue-600 hover:underline"
						>
							Criar Anotação
						</Link>
					</div>
					<div className="bg-white shadow-md rounded-lg p-6">
						<h3 className="text-xl font-semibold text-gray-900 mb-4">
							Gerenciar Categorias
						</h3>
						<p className="text-gray-600 mb-4">
							Organize suas anotações em categorias para facilitar a busca e o
							acesso.
						</p>
						<Link href="/categories" className="text-blue-600 hover:underline">
							Gerenciar Categorias
						</Link>
					</div>
					<div className="bg-white shadow-md rounded-lg p-6">
						<h3 className="text-xl font-semibold text-gray-900 mb-4">
							Compartilhar Anotações
						</h3>
						<p className="text-gray-600 mb-4">
							Compartilhe suas anotações com amigos ou mantenha-as privadas.
						</p>
						<Link href="/notes/share" className="text-blue-600 hover:underline">
							Compartilhar Anotações
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
