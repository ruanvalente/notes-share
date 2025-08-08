import { createSupabaseServerClient } from "@/lib/supabase/server";
import { handleError } from "@/utils/erros/error-handler";
import { Note, SearchOptions } from "@/utils/types/note-types";

async function createNote(
	noteData: Omit<Note, "id" | "created_at" | "updated_at">
): Promise<Note> {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("Usuário não autenticado");
	}

	if (!noteData.title.trim()) {
		throw new Error("Título é obrigatório");
	}

	if (!noteData.content.trim()) {
		throw new Error("Conteúdo é obrigatório");
	}

	try {
		const { data, error } = await supabase
			.from("notes")
			.insert([
				{
					title: noteData.title.trim(),
					content: noteData.content.trim(),
					is_public: noteData.is_public,
					tags: noteData.tags.filter((tag) => tag.trim() !== ""),
					user_id: user.id,
				},
			])
			.select()
			.single();

		if (error) {
			handleError(error, "criar nota");
		}

		return data as Note;
	} catch (error) {
		handleError(error as Error, "criar nota");
	}
}

async function updateNote(
	id: string,
	noteData: Partial<Omit<Note, "id" | "created_at" | "updated_at">>
): Promise<Note> {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("Usuário não autenticado");
	}

	if (!id) {
		throw new Error("ID da nota é obrigatório");
	}

	const updateData: Partial<Note> = {};

	if (noteData.title !== undefined) {
		if (!noteData.title.trim()) {
			throw new Error("Título não pode estar vazio");
		}
		updateData.title = noteData.title.trim();
	}

	if (noteData.content !== undefined) {
		if (!noteData.content.trim()) {
			throw new Error("Conteúdo não pode estar vazio");
		}
		updateData.content = noteData.content.trim();
	}

	if (noteData.is_public !== undefined) {
		updateData.is_public = noteData.is_public;
	}

	if (noteData.tags !== undefined) {
		updateData.tags = noteData.tags.filter((tag) => tag.trim() !== "");
	}

	try {
		const { data, error } = await supabase
			.from("notes")
			.update(updateData)
			.eq("id", id)
			.eq("user_id", user.id)
			.select()
			.single();

		if (error) {
			handleError(error, "atualizar nota");
		}

		return data as Note;
	} catch (error) {
		handleError(error as Error, "atualizar nota");
	}
}

async function deleteNote(id: string): Promise<boolean> {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("Usuário não autenticado");
	}

	if (!id) {
		throw new Error("ID da nota é obrigatório");
	}

	try {
		const { error } = await supabase
			.from("notes")
			.delete()
			.eq("id", id)
			.eq("user_id", user.id);

		if (error) {
			handleError(error, "excluir nota");
		}

		return true;
	} catch (error) {
		handleError(error as Error, "excluir nota");
	}
}

async function getNoteById(id: string): Promise<Note | null> {
	const supabase = await createSupabaseServerClient();

	if (!id) {
		throw new Error("ID da nota é obrigatório");
	}

	try {
		const { data, error } = await supabase
			.from("notes")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			if (error.code === "PGRST116") {
				return null;
			}
			handleError(error, "buscar nota");
		}

		return data as Note;
	} catch (error) {
		handleError(error as Error, "buscar nota");
	}
}

async function getAllNotes(): Promise<Note[]> {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("Usuário não autenticado");
	}

	try {
		const { data, error } = await supabase
			.from("notes")
			.select("*")
			.eq("user_id", user.id)
			.order("created_at", { ascending: false });

		if (error) {
			handleError(error, "carregar notas");
		}

		return (data as Note[]) || [];
	} catch (error) {
		handleError(error as Error, "carregar notas");
	}
}

async function searchNotes(
	query: string,
	options: SearchOptions = {}
): Promise<Note[]> {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("Usuário não autenticado");
	}

	if (!query.trim()) {
		throw new Error("Termo de pesquisa é obrigatório");
	}

	const {
		searchInTitle = true,
		searchInContent = true,
		searchInTags = true,
		isPublicOnly = false,
		limit = 50,
	} = options;

	try {
		let queryBuilder = supabase
			.from("notes")
			.select("*")
			.eq("user_id", user.id);

		const searchConditions: string[] = [];

		if (searchInTitle) {
			searchConditions.push(`title.ilike.%${query}%`);
		}

		if (searchInContent) {
			searchConditions.push(`content.ilike.%${query}%`);
		}

		if (searchInTags) {
			searchConditions.push(`tags.cs.{${query}}`);
		}

		if (searchConditions.length > 0) {
			queryBuilder = queryBuilder.or(searchConditions.join(","));
		}

		if (isPublicOnly) {
			queryBuilder = queryBuilder.eq("is_public", true);
		}

		queryBuilder = queryBuilder
			.order("created_at", { ascending: false })
			.limit(limit);

		const { data, error } = await queryBuilder;

		if (error) {
			handleError(error, "pesquisar notas");
		}

		return (data as Note[]) || [];
	} catch (error) {
		handleError(error as Error, "pesquisar notas");
	}
}

async function getPublicNotes(): Promise<Note[]> {
	const supabase = await createSupabaseServerClient();

	try {
		const { data, error } = await supabase
			.from("notes")
			.select("*")
			.eq("is_public", true)
			.order("created_at", { ascending: false });

		if (error) {
			handleError(error, "carregar notas públicas");
		}

		return (data as Note[]) || [];
	} catch (error) {
		handleError(error as Error, "carregar notas públicas");
	}
}

export {
	createNote,
	updateNote,
	deleteNote,
	getNoteById,
	getAllNotes,
	searchNotes,
	getPublicNotes,
};
