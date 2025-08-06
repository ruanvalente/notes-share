import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { EmptyNote, NoteCard } from "@/components/shared/note";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllNotes } from "@/service";

export default async function DashboardPage() {
	const notes = await getAllNotes();
	const hasNotes = notes && notes.length > 0;

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
					className="w-full mt-4 md:w-auto md:mt-0 flex justify-end"
				>
					<Button className="flex items-center justify-center md:space-x-2 w-fit md:w-auto hover:cursor-pointer rounded-full md:rounded-md">
						<Plus className="h-4 w-4" />
						<span className="hidden md:inline">Nova Anotação</span>
					</Button>
				</Link>
			</div>

			<div className="relative mb-8">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
				<Input placeholder="Buscar anotações..." className="pl-10 max-w-md" />
			</div>

			{hasNotes ? (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{notes.map((note) => (
						<NoteCard key={note.id} note={note} />
					))}
				</div>
			) : (
				<EmptyNote />
			)}
		</section>
	);
}
