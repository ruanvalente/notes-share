"use client";

import { useMemo, useEffect, useState } from "react";
import { Note } from "@/utils/types/note-types";
import { NotesState } from "@/state/types/notes-state-type";

export function useDebouncedTerm(searchTerm: string, delay = 1000) {
	const [debouncedTerm, setDebouncedTerm] = useState("");

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedTerm(searchTerm);
		}, delay);

		return () => clearTimeout(handler);
	}, [searchTerm, delay]);

	return debouncedTerm;
}

export function useFilteredNotes(notes: Note[], term: string) {
	return useMemo(() => {
		if (!term.trim()) return notes;
		const lowerTerm = term.toLowerCase();
		return notes.filter(
			(note) =>
				note.title.toLowerCase().includes(lowerTerm) ||
				note.content.toLowerCase().includes(lowerTerm) ||
				note.tags.some((tag) => tag.toLowerCase().includes(lowerTerm))
		);
	}, [notes, term]);
}

export function useClearButtonEnabled(state: NotesState) {
	return (
		state.title.trim() !== "" ||
		state.content.trim() !== "" ||
		state.tags.length > 0
	);
}
