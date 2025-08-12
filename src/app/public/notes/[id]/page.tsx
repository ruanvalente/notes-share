import { getNoteByIdAction } from "@/actions";
import PublicNotePageClient from "@/components/shared/note/public-note/public-note-page-client";
import { PublicNote } from "@/utils/types/note-types";

type Params = { params: Promise<{ id: string }> };

export default async function PublicNotePage({ params }: Params) {
	const { id } = await params;

	const result = await getNoteByIdAction(id);
	const data = result.data as PublicNote;

	if (!result.success || !result.data) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p>Nota não encontrada ou link expirado.</p>
			</div>
		);
	}

	return <PublicNotePageClient note={data} />;
}
