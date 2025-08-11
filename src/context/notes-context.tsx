"use client";

import React, {
	createContext,
	useReducer,
	useContext,
	ReactNode,
	useCallback,
	useRef,
	useState,
	useEffect,
	useMemo,
} from "react";
import { useRouter } from "next/navigation";
import {
	createNoteAction,
	deleteNoteAction,
	updateNoteAction,
} from "@/actions";
import { useToast } from "@/hooks/use-toast";

import { NotesState } from "@/state/types/notes-state-type";
import { notesReducer } from "@/state";
import { Note } from "@/utils/types/note-types";

type NotesContextProps = {
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
	) => Promise<void>;
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

const initialState: NotesState = {
	notes: [],
	searchTerm: "",
	title: "",
	content: "",
	tags: [],
	isPublic: false,
	error: null,
	isPending: false,
	isClearButtonEnabled: false,
	debouncedTerm: "",
};

const NotesContext = createContext<NotesContextProps | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(notesReducer, initialState);
	const [debouncedTerm, setDebouncedTerm] = useState("");
	const router = useRouter();
	const formRef = useRef<HTMLFormElement>(null);
	const { toastSuccess, toastError } = useToast();

	const isClearButtonEnabled =
		state.title.trim() !== "" ||
		state.content.trim() !== "" ||
		state.tags.length > 0;

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedTerm(state.searchTerm);
		}, 1000);

		return () => clearTimeout(handler);
	}, [state.searchTerm]);

	const filteredNotes = useMemo(() => {
		if (!debouncedTerm.trim()) return state.notes;

		const lowerTerm = debouncedTerm.toLowerCase();

		return state.notes.filter(
			(note) =>
				note.title.toLowerCase().includes(lowerTerm) ||
				note.content.toLowerCase().includes(lowerTerm) ||
				note.tags.some((tag) => tag.toLowerCase().includes(lowerTerm))
		);
	}, [state.notes, debouncedTerm]);

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

	const handleCreateNote = useCallback(
		async (formData: FormData, onSuccess?: () => void) => {
			dispatch({ type: "SET_PENDING", payload: true });
			try {
				formData.append("tags", state.tags.join(","));
				formData.append("isPublic", state.isPublic.toString());

				const result = await createNoteAction(formData);

				if (result.success) {
					toastSuccess("Nota criada com sucesso");
					router.push("/dashboard");
					if (onSuccess) onSuccess();
				} else {
					toastError("Não foi possível criar a nota", {
						description: result.error || "Erro ao criar nota",
					});
					if (onSuccess) onSuccess();
				}
			} catch (err) {
				const message = (err as Error).message || "Erro inesperado";
				toastError("Não foi possível criar a nota", { description: message });
				setError(message);
				if (onSuccess) onSuccess();
			} finally {
				dispatch({ type: "SET_PENDING", payload: false });
			}
		},
		[state.tags, state.isPublic, router, toastSuccess, toastError, setError]
	);

	const handleDeleteNote = useCallback(
		async (id: string, onSuccess?: () => void) => {
			dispatch({ type: "SET_PENDING", payload: true });
			try {
				const result = await deleteNoteAction(id);

				if (result.success) {
					toastSuccess("Nota excluída com sucesso");
					router.refresh();
					if (onSuccess) onSuccess();
				} else {
					toastError("Não foi possível excluir a nota", {
						description: result.error || "Erro ao excluir nota",
					});
					if (onSuccess) onSuccess();
				}
			} catch (err) {
				const message = (err as Error).message || "Erro inesperado";
				toastError("Não foi possível excluir a nota", { description: message });
				setError(message);
				if (onSuccess) onSuccess();
			} finally {
				dispatch({ type: "SET_PENDING", payload: false });
			}
		},
		[router, toastSuccess, toastError, setError]
	);

	const handleClear = useCallback(() => {
		dispatch({ type: "CLEAR" });
		if (formRef.current) {
			formRef.current.reset();
		}
	}, []);

	const handleUpdateNote = useCallback(
		async (id: string, formData: FormData, onSuccess?: () => void) => {
			dispatch({ type: "SET_PENDING", payload: true });
			try {
				const tagsString = formData.get("tags") as string;
				const isPublic = formData.get("isPublic") === "true";
				formData.set("tags", tagsString);
				formData.set("isPublic", isPublic.toString());

				const result = await updateNoteAction(id, formData);

				if (result.success) {
					toastSuccess("Nota atualizada com sucesso");
					router.push("/dashboard");
					if (onSuccess) onSuccess();
				} else {
					toastError("Não foi possível atualizar a nota", {
						description: result.error || "Erro ao atualizar nota",
					});
					setError(result.error || "Erro ao atualizar nota");
					if (onSuccess) onSuccess();
				}
			} catch (err) {
				const message = (err as Error).message || "Erro inesperado";
				toastError("Não foi possível atualizar a nota", {
					description: message,
				});
				setError(message);
				if (onSuccess) onSuccess();
			} finally {
				dispatch({ type: "SET_PENDING", payload: false });
			}
		},
		[router, toastSuccess, toastError, setError]
	);

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

export function useNotes() {
	const context = useContext(NotesContext);
	if (!context) throw new Error("useNotes must be used within a NotesProvider");
	return context;
}
