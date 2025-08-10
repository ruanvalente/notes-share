import { Note } from "@/utils/types/note-types";

export type NotesState = {
	notes: Note[];
	searchTerm: string;
	debouncedTerm: string;
	title: string;
	content: string;
	tags: string[];
	isPublic: boolean;
	error: string | null;
	isPending: boolean;
	isClearButtonEnabled: boolean;
};

export type NotesAction =
	| { type: "SET_NOTES"; payload: Note[] }
	| { type: "SET_SEARCH_TERM"; payload: string }
	| { type: "SET_TITLE"; payload: string }
	| { type: "SET_CONTENT"; payload: string }
	| { type: "SET_TAGS"; payload: string[] }
	| { type: "SET_IS_PUBLIC"; payload: boolean }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "SET_PENDING"; payload: boolean }
	| { type: "CLEAR" };
