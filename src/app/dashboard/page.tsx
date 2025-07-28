import { Header } from "@/components/shared/header/header";

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
		</>
	);
}
