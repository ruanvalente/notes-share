import { getNoteById } from "@/service/notes-service";
import { NoteForm } from "@/components/shared/note";
import { Note } from "@/utils/types/note-types";

type EditNotePageProps = {
	params: Promise<{ id: string }>;
};

export default async function EditNotePage({ params }: EditNotePageProps) {
	const { id } = await params;

	let note: Note | null = null;

	try {
		note = await getNoteById(id);
	} catch (error) {
		console.error(`[EditNotePage] Erro ao carregar nota (${id}):`, error);
	}

	if (!note) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<p className="text-gray-500 text-lg">Nenhuma anotação encontrada.</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<main className="container mx-auto px-4 py-8 max-w-4xl">
				<header className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Editar Anotação</h1>
					<p className="text-gray-600 mt-2">
						Altere apenas o que for necessário e salve as mudanças.
					</p>
				</header>
				<NoteForm noteId={id} initialNote={note} />
			</main>
		</div>
	);
}
