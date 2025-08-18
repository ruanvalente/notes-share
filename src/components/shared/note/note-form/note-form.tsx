"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { FormField } from "@/components/shared/form-field";
import { PublicSwitch, TagsInput } from "@/components/shared/note";
import { validateNoteForm } from "@/utils/erros";

import { useToast } from "@/hooks/use-toast";
import { Note } from "@/utils/types/note-types";
import { useNotes } from "@/context";

type NoteFormProps = {
	noteId?: string;
	initialNote?: Note | null;
};

export function NoteForm({ noteId, initialNote }: NoteFormProps) {
	const { handleCreateNote, handleUpdateNote } = useNotes();
	const { toastError } = useToast();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [isPublic, setIsPublic] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<{
		title?: string;
		content?: string;
	}>({});
	const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		if (noteId && initialNote) {
			setTitle(initialNote.title);
			setContent(initialNote.content);
			setTags(initialNote.tags ?? []);
			setIsPublic(initialNote.is_public);
		} else {
			setTitle("");
			setContent("");
			setTags([]);
			setIsPublic(false);
			setFieldErrors({});
		}
	}, [noteId, initialNote]);

	const validateForm = useCallback((): boolean => {
		const errors = validateNoteForm({ title, content });
		setFieldErrors(errors);

		const firstError = Object.values(errors)[0];
		if (firstError) {
			toastError(firstError);
			return false;
		}

		return true;
	}, [title, content, toastError]);

	const onSubmit = useCallback(
		async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!validateForm()) return;

			const formData = new FormData();
			formData.set("title", title);
			formData.set("content", content);
			formData.set("tags", tags.join(","));
			formData.set("isPublic", isPublic.toString());

			setIsPending(true);
			try {
				if (noteId) {
					await handleUpdateNote(noteId, formData);
				} else {
					await handleCreateNote(formData);
				}
			} finally {
				setIsPending(false);
			}
		},
		[
			title,
			content,
			tags,
			isPublic,
			noteId,
			handleCreateNote,
			handleUpdateNote,
			validateForm,
		]
	);

	const getSubmitLabel = useCallback(() => {
		if (isPending) return noteId ? "Atualizando..." : "Salvando...";
		return noteId ? "Atualizar Anotação" : "Salvar Anotação";
	}, [isPending, noteId]);

	const isClearButtonEnabled =
		title.trim() !== "" || content.trim() !== "" || tags.length > 0;

	const handleClear = () => {
		setTitle("");
		setContent("");
		setTags([]);
		setIsPublic(false);
		setFieldErrors({});
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardContent>
					<form onSubmit={onSubmit} className="space-y-6">
						<FormField label="Título *" id="title" error={fieldErrors.title}>
							<Input
								id="title"
								name="title"
								placeholder="Digite o título da sua anotação..."
								required
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className={clsx({
									"border-red-500 focus-visible:ring-red-500":
										fieldErrors.title,
								})}
							/>
						</FormField>

						<FormField
							label="Conteúdo *"
							id="content"
							error={fieldErrors.content}
						>
							<Textarea
								id="content"
								name="content"
								placeholder="Escreva o conteúdo da sua anotação..."
								rows={12}
								required
								value={content}
								onChange={(e) => setContent(e.target.value)}
								className={clsx({
									"border-red-500 focus-visible:ring-red-500":
										fieldErrors.content,
								})}
							/>
						</FormField>

						<TagsInput value={tags} onChange={setTags} />
						<PublicSwitch value={isPublic} onChange={setIsPublic} />

						<div className="flex items-center space-x-4 pt-4">
							<Button
								disabled={isPending}
								type="submit"
								className="hover:cursor-pointer"
							>
								{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{getSubmitLabel()}
							</Button>

							{noteId ? (
								<Link prefetch href="/dashboard">
									<Button
										type="button"
										variant="outline"
										className="hover:cursor-pointer"
									>
										<ChevronLeft className="h-4 w-4" />
										Voltar
									</Button>
								</Link>
							) : (
								<Button
									type="button"
									variant="outline"
									className="hover:cursor-pointer"
									disabled={!isClearButtonEnabled}
									onClick={handleClear}
								>
									Limpar
								</Button>
							)}
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
