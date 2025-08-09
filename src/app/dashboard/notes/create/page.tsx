import { NoteForm } from "@/components/shared/note";

export default function CreateNotePage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<main className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900">Nova Anotação</h1>
						<p className="text-gray-600 mt-2">
							Crie uma nova anotação e organize suas ideias
						</p>
					</div>
					<NoteForm />
				</div>
			</main>
		</div>
	);
}
