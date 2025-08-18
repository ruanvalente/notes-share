"use client";

import { Dispatch } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
	createNoteAction,
	deleteNoteAction,
	updateNoteAction,
} from "@/actions";
import { NotesAction, NotesState } from "@/state/types/notes-state-type";
import { useToast } from "@/hooks/use-toast";

type ActionDispatch = Dispatch<NotesAction>;

export function createHandleCreateNote(
	dispatch: ActionDispatch,
	state: NotesState,
	router: AppRouterInstance,
	setError: (msg: string | null) => void
) {
	return async (formData: FormData, onSuccess?: () => void) => {
		dispatch({ type: "SET_PENDING", payload: true });
		const toast = useToast();
		try {
			formData.append("tags", state.tags.join(","));
			formData.append("isPublic", state.isPublic.toString());

			const result = await createNoteAction(formData);

			if (result.success && result.data) {
				toast.toastSuccess("Nota criada com sucesso");
				router.push("/dashboard");
				onSuccess?.();
				return result.data.id;
			} else {
				toast.toastError("Não foi possível criar a nota", {
					description: result.error || "Erro ao criar nota",
				});
			}
		} catch (err) {
			const message = (err as Error).message || "Erro inesperado";
			toast.toastError("Não foi possível criar a nota", {
				description: message,
			});
			setError(message);
		} finally {
			dispatch({ type: "SET_PENDING", payload: false });
		}
	};
}

export function createHandleDeleteNote(
	dispatch: ActionDispatch,
	router: AppRouterInstance,
	setError: (msg: string | null) => void
) {
	return async (id: string, onSuccess?: () => void) => {
		dispatch({ type: "SET_PENDING", payload: true });
		const toast = useToast();

		try {
			const result = await deleteNoteAction(id);

			if (result.success) {
				toast.toastSuccess("Nota excluída com sucesso");
				router.refresh();
				onSuccess?.();
			} else {
				toast.toastError("Não foi possível excluir a nota", {
					description: result.error || "Erro ao excluir nota",
				});
				onSuccess?.();
			}
		} catch (err) {
			const message = (err as Error).message || "Erro inesperado";
			toast.toastError("Não foi possível excluir a nota", {
				description: message,
			});
			setError(message);
			onSuccess?.();
		} finally {
			dispatch({ type: "SET_PENDING", payload: false });
		}
	};
}

export function createHandleUpdateNote(
	dispatch: ActionDispatch,
	router: AppRouterInstance,
	setError: (msg: string | null) => void
) {
	return async (id: string, formData: FormData, onSuccess?: () => void) => {
		const toast = useToast();
		dispatch({ type: "SET_PENDING", payload: true });
		try {
			const tagsString = formData.get("tags") as string;
			const isPublic = formData.get("isPublic") === "true";

			formData.set("tags", tagsString);
			formData.set("isPublic", isPublic.toString());

			const result = await updateNoteAction(id, formData);

			if (result.success) {
				toast.toastSuccess("Nota atualizada com sucesso");
				router.push("/dashboard");
				onSuccess?.();
			} else {
				toast.toastError("Não foi possível atualizar a nota", {
					description: result.error || "Erro ao atualizar nota",
				});
				setError(result.error || "Erro ao atualizar nota");
				onSuccess?.();
			}
		} catch (err) {
			const message = (err as Error).message || "Erro inesperado";
			toast.toastError("Não foi possível atualizar a nota", {
				description: message,
			});
			setError(message);
			onSuccess?.();
		} finally {
			dispatch({ type: "SET_PENDING", payload: false });
		}
	};
}

export function createHandleClear(
	dispatch: ActionDispatch,
	formRef?: React.RefObject<HTMLFormElement | null>
) {
	return () => {
		dispatch({ type: "CLEAR" });
		if (formRef?.current) {
			formRef.current.reset();
		}
	};
}
