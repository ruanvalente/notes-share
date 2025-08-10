import { Note } from "@/utils/types/note-types";
import { NotesState } from "./types/notes-state-type";

type Action =
	| { type: "SET_NOTES"; payload: Note[] }
	| { type: "SET_SEARCH_TERM"; payload: string }
	| { type: "SET_TITLE"; payload: string }
	| { type: "SET_CONTENT"; payload: string }
	| { type: "SET_TAGS"; payload: string[] }
	| { type: "SET_IS_PUBLIC"; payload: boolean }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "SET_PENDING"; payload: boolean }
	| { type: "CLEAR" };

export function notesReducer(state: NotesState, action: Action): NotesState {
	switch (action.type) {
		case "SET_NOTES":
			return { ...state, notes: action.payload };
		case "SET_SEARCH_TERM":
			return { ...state, searchTerm: action.payload };
		case "SET_TITLE":
			return { ...state, title: action.payload };
		case "SET_CONTENT":
			return { ...state, content: action.payload };
		case "SET_TAGS":
			return { ...state, tags: action.payload };
		case "SET_IS_PUBLIC":
			return { ...state, isPublic: action.payload };
		case "SET_ERROR":
			return { ...state, error: action.payload };
		case "SET_PENDING":
			return { ...state, isPending: action.payload };
		case "CLEAR":
			return {
				...state,
				title: "",
				content: "",
				tags: [],
				isPublic: false,
				error: null,
				isPending: false,
				isClearButtonEnabled: false,
			};
		default:
			return state;
	}
}
