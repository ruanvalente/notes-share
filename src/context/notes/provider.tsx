"use client";

import React, { useReducer, useRef, useCallback } from "react";
import { notesReducer } from "@/state";
import { useRouter } from "next/navigation";
import { Note } from "@/utils/types/note-types";
import { initialState } from "./initial-state";
import {
	useClearButtonEnabled,
	useDebouncedTerm,
	useFilteredNotes,
} from "./hooks";
import {
	createHandleClear,
	createHandleCreateNote,
	createHandleDeleteNote,
	createHandleUpdateNote,
} from "./actions";
import { NotesContext } from "./context";

export function NotesProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(notesReducer, initialState);
	const router = useRouter();
	const formRef = useRef<HTMLFormElement>(null);

	const debouncedTerm = useDebouncedTerm(state.searchTerm);
	const filteredNotes = useFilteredNotes(state.notes, debouncedTerm);
	const isClearButtonEnabled = useClearButtonEnabled(state);

	const setSearchTerm = useCallback(
		(term: string) => dispatch({ type: "SET_SEARCH_TERM", payload: term }),
		[]
	);
	const setNotes = useCallback(
		(notes: Note[]) => dispatch({ type: "SET_NOTES", payload: notes }),
		[]
	);
	const setTitle = useCallback(
		(title: string) => dispatch({ type: "SET_TITLE", payload: title }),
		[]
	);
	const setContent = useCallback(
		(content: string) => dispatch({ type: "SET_CONTENT", payload: content }),
		[]
	);
	const setTags = useCallback(
		(tags: string[]) => dispatch({ type: "SET_TAGS", payload: tags }),
		[]
	);
	const setIsPublic = useCallback(
		(isPublic: boolean) =>
			dispatch({ type: "SET_IS_PUBLIC", payload: isPublic }),
		[]
	);
	const setError = useCallback(
		(error: string | null) => dispatch({ type: "SET_ERROR", payload: error }),
		[]
	);

	const handleCreateNote = createHandleCreateNote(
		dispatch,
		state,
		router,
		setError
	);
	const handleDeleteNote = createHandleDeleteNote(dispatch, router, setError);
	const handleUpdateNote = createHandleUpdateNote(dispatch, router, setError);
	const handleClear = createHandleClear(dispatch, formRef);

	return (
		<NotesContext.Provider
			value={{
				...state,
				formRef,
				isClearButtonEnabled,
				filteredNotes,
				debouncedTerm,
				setTitle,
				setContent,
				setTags,
				setIsPublic,
				setError,
				setSearchTerm,
				setNotes,
				handleCreateNote,
				handleDeleteNote,
				handleClear,
				handleUpdateNote,
			}}
		>
			{children}
		</NotesContext.Provider>
	);
}
