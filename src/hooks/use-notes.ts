"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
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

	const handleCreateNote = (formData: FormData, onSuccess?: () => void) => {
		startTransition(async () => {
			formData.append("tags", tags.join(","));
			formData.append("isPublic", isPublic.toString());

			const result = await createNoteAction(formData);

			if (result.success) {
				toastSuccess("Nota criada com sucesso");
				router.push("/dashboard"); // ou router.refresh() se quiser recarregar no mesmo local
				if (onSuccess) onSuccess();
			} else {
				toastError("Não foi possível criar a nota", {
					description: result.error || "Erro ao criar nota",
				});
				if (onSuccess) onSuccess();
			}
		});
	};

	const handleClear = () => {
		setTitle("");
		setContent("");
		setTags([]);
		setIsPublic(false);
		if (formRef.current) {
			formRef.current.reset();
		}
	};

	const handleDeleteNote = (id: string, onSuccess?: () => void) => {
		startTransition(async () => {
			const result = await deleteNoteAction(id);
			if (result.success) {
				toastSuccess("Nota excluída com sucesso");
				router.refresh();
				if (onSuccess) onSuccess();
			} else {
				toastError("Não foi possível criar a nota", {
					description: result.error || "Erro ao criar nota",
				});
				setError(result.error as string);
				if (onSuccess) onSuccess();
			}
		});
	};

	return {
		title,
		content,
		tags,
		isPublic,
		error,
		formRef,
		isClearButtonEnabled,
		setTitle,
		setContent,
		setTags,
		setIsPublic,
		handleCreateNote,
		handleClear,
		handleDeleteNote,
		isPending,
	};
}
