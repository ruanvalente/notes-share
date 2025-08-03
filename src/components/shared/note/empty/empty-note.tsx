import { Button } from "@/components/ui/button";
import { Link, Plus } from "lucide-react";
import { Note } from "../card/note-card";

type EmptyNoteProps = {
	note: Array<Note>;
};

export function EmptyNote({ note }: EmptyNoteProps) {
	return (
		<>
			{note.length === 0 && (
				<div className="text-center py-12">
					<div className="text-gray-400 mb-4">
						<Plus className="h-16 w-16 mx-auto" />
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						Nenhuma anotação encontrada
					</h3>
					<p className="text-gray-600 mb-4">
						Comece criando sua primeira anotação
					</p>
					<Link href="/notes/create">
						<Button>Criar primeira anotação</Button>
					</Link>
				</div>
			)}
		</>
	);
}
