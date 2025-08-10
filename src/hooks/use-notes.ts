"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, useCallback } from "react";
import { createNoteAction, deleteNoteAction } from "@/actions";
import { useToast } from "@/hooks/use-toast";

export function useNotes() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [isPublic, setIsPublic] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();
	const { toastSuccess, toastError } = useToast();

	const isClearButtonEnabled =
		title.trim() !== "" || content.trim() !== "" || tags.length > 0;

	const handleError = useCallback(
		(errorMessage: string | undefined, onSuccess?: () => void) => {
			toastError("Ocorreu um erro", {
				description: errorMessage || "Erro inesperado",
			});
			setError(errorMessage || "Erro inesperado");
			if (onSuccess) onSuccess();
		},
		[toastError]
	);

	const handleCreateNote = useCallback(
		(formData: FormData, onSuccess?: () => void) => {
			startTransition(() => {
				(async () => {
					try {
						formData.append("tags", tags.join(","));
						formData.append("isPublic", isPublic.toString());

						const result = await createNoteAction(formData);

						if (result.success) {
							toastSuccess("Nota criada com sucesso");
							router.push("/dashboard");
							if (onSuccess) onSuccess();
						} else {
							handleError(result.error, onSuccess);
						}
					} catch (err) {
						handleError((err as Error).message, onSuccess);
					}
				})();
			});
		},
		[tags, isPublic, router, toastSuccess, handleError]
	);

	const handleClear = useCallback(() => {
		setTitle("");
		setContent("");
		setTags([]);
		setIsPublic(false);
		if (formRef.current) {
			formRef.current.reset();
		}
	}, []);

	const handleDeleteNote = useCallback(
		(id: string, onSuccess?: () => void) => {
			startTransition(() => {
				(async () => {
					try {
						const result = await deleteNoteAction(id);
						if (result.success) {
							toastSuccess("Nota excluída com sucesso");
							router.refresh();
							if (onSuccess) onSuccess();
						} else {
							handleError(result.error, onSuccess);
						}
					} catch (err) {
						handleError((err as Error).message, onSuccess);
					}
				})();
			});
		},
		[router, toastSuccess, handleError]
	);

	return {
		title,
		content,
		tags,
		isPublic,
		error,
		formRef,
		isClearButtonEnabled,
		isPending,
		setTitle,
		setContent,
		setTags,
		setIsPublic,
		handleCreateNote,
		handleClear,
		handleDeleteNote,
	};
}
