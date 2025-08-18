"use client";

import { createContext, useContext } from "react";
import { NotesState } from "@/state/types/notes-state-type";
import { Note } from "@/utils/types/note-types";

export type NotesContextProps = {
	setTitle: (title: string) => void;
	setContent: (content: string) => void;
	setTags: (tags: string[]) => void;
	setIsPublic: (isPublic: boolean) => void;
	setError: (error: string | null) => void;
	setSearchTerm: (term: string) => void;
	setNotes: (notes: Note[]) => void;
	handleCreateNote: (
		formData: FormData,
		onSuccess?: () => void
	) => Promise<string | undefined>;
	handleDeleteNote: (id: string, onSuccess?: () => void) => Promise<void>;
	handleClear: () => void;
	handleUpdateNote: (
		id: string,
		formData: FormData,
		onSuccess?: () => void
	) => Promise<void>;
	formRef: React.RefObject<HTMLFormElement | null>;
	filteredNotes: Note[];
} & NotesState;

export const NotesContext = createContext<NotesContextProps | undefined>(
	undefined
);

export function useNotes() {
	const context = useContext(NotesContext);
	if (!context) throw new Error("useNotes must be used within a NotesProvider");
	return context;
}
