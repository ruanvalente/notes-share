import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Header } from "@/components/shared/header";
import { EmptyNote, NoteCard } from "@/components/shared/note";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockNotes = [
	{
		id: "1",
		title: "Ideias para o projeto",
		content: "Algumas ideias interessantes para implementar no novo projeto...",
		isPublic: false,
		createdAt: "2024-01-15",
		tags: ["trabalho", "ideias"],
	},
	{
		id: "2",
		title: "Receita de bolo de chocolate",
		content: "Ingredientes: 2 xícaras de farinha, 1 xícara de açúcar...",
		isPublic: true,
		createdAt: "2024-01-14",
		tags: ["receitas", "doces"],
	},
	{
		id: "3",
		title: "Lista de livros para ler",
		content: "1. O Alquimista - Paulo Coelho\n2. 1984 - George Orwell...",
		isPublic: false,
		createdAt: "2024-01-13",
		tags: ["livros", "leitura"],
	},
];

export default function DashboardPage() {
	const hasNotes = mockNotes && mockNotes.length > 0;

	return (
		<section className="container mx-auto px-4 py-8">
			<div className="flex flex-col items-center justify-between mb-8 md:flex-row">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Minhas Anotações</h1>
					<p className="text-gray-600 mt-2">
						Gerencie e organize suas anotações pessoais
					</p>
				</div>
				<Link
					prefetch
					href="/dashboard/notes/create"
					className="w-full mt-4 md:w-auto md:mt-0"
				>
					<Button className="flex items-center space-x-2 w-full md:w-auto hover:cursor-pointer">
						<Plus className="h-4 w-4" />
						<span>Nova Anotação</span>
					</Button>
				</Link>
			</div>

			<div className="relative mb-8">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
				<Input placeholder="Buscar anotações..." className="pl-10 max-w-md" />
			</div>

			{hasNotes ? (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{mockNotes.map((note) => (
						<NoteCard key={note.id} note={note} />
					))}
				</div>
			) : (
				<EmptyNote />
			)}
		</section>
	);
}
