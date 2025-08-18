import { NotesState } from "@/state/types/notes-state-type";

export const initialState: NotesState = {
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
