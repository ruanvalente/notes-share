"use client";

import { createNoteAction } from "@/actions/";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function useNotes() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [isPublic, setIsPublic] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();

	const isClearButtonEnabled =
		title.trim() !== "" || content.trim() !== "" || tags.length > 0;

	const handleCreateNote = async (formData: FormData) => {
		try {
			setError(null);
			formData.append("tags", tags.join(","));
			formData.append("isPublic", isPublic.toString());

			const result = await createNoteAction(formData);
			if (result?.error) {
				setError(result.error);
				return;
			}
			router.push("/dashboard");
		} catch (error) {
			console.log("error", error);
			setError("Erro inesperado ao salvar a anotação.");
		}
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
	};
}
