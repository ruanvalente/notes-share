"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
	createNote,
	updateNote,
	deleteNote,
	searchNotes,
} from "@/service/notes-service";
import { SearchOptions } from "@/utils/types/note-types";

interface ActionResult {
	success: boolean;
	error?: string;
	data?: unknown;
}

export async function createNoteAction(
	formData: FormData
): Promise<ActionResult> {
	try {
		const title = formData.get("title") as string;
		const content = formData.get("content") as string;
		const isPublic = formData.get("isPublic") === "true";
		const tagsString = formData.get("tags") as string;
		const tags = tagsString
			? tagsString
					.split(",")
					.map((tag) => tag.trim())
					.filter(Boolean)
			: [];

		const noteData = {
			title,
			content,
			is_public: isPublic,
			tags,
		};

		const newNote = await createNote(noteData);

		revalidatePath("/dashboard");

		return {
			success: true,
			data: newNote,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Erro desconhecido ao criar nota",
		};
	}
}

export async function updateNoteAction(
	id: string,
	formData: FormData
): Promise<ActionResult> {
	try {
		const title = formData.get("title") as string;
		const content = formData.get("content") as string;
		const isPublic = formData.get("isPublic") === "true";
		const tagsString = formData.get("tags") as string;
		const tags = tagsString
			? tagsString
					.split(",")
					.map((tag) => tag.trim())
					.filter(Boolean)
			: [];

		const noteData = {
			title,
			content,
			is_public: isPublic,
			tags,
		};

		const updatedNote = await updateNote(id, noteData);

		revalidatePath("/dashboard");

		return {
			success: true,
			data: updatedNote,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Erro desconhecido ao atualizar nota",
		};
	}
}

export async function deleteNoteAction(id: string): Promise<ActionResult> {
	try {
		const success = await deleteNote(id);
		if (success) {
			revalidatePath("/dashboard");
			return { success: true };
		}
		return { success: false, error: "Falha ao excluir a nota" };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Erro desconhecido ao excluir nota",
		};
	}
}

export async function searchNotesAction(
	query: string,
	options?: SearchOptions
): Promise<ActionResult> {
	try {
		const results = await searchNotes(query, options);

		return {
			success: true,
			data: results,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Erro desconhecido ao pesquisar notas",
		};
	}
}

export async function searchNotesFormAction(formData: FormData): Promise<void> {
	try {
		const query = formData.get("query") as string;

		if (!query.trim()) {
			redirect("/");
			return;
		}

		const searchParams = new URLSearchParams({
			query: query.trim(),
		});

		redirect(`/?${searchParams.toString()}`);
	} catch (error) {
		const errorMessage =
			error instanceof Error
				? error.message
				: "Erro desconhecido ao pesquisar notas";
		redirect(`/?error=${encodeURIComponent(errorMessage)}`);
	}
}
