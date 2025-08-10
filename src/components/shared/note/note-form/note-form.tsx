"use client";

import { FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { PublicSwitch } from "../public-switch";
import { TagsInput } from "../tags-input";
import { useNotes } from "@/context";

export function NoteForm() {
	const {
		title,
		formRef,
		content,
		tags,
		isPublic,
		isClearButtonEnabled,
		error,
		setTitle,
		setContent,
		setTags,
		setIsPublic,
		handleCreateNote,
		handleClear,
	} = useNotes();

	const { pending } = useFormStatus();

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!formRef.current) return;
		const formData = new FormData(formRef.current);
		await handleCreateNote(formData);
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardContent>
					{error && (
						<Alert className="mb-4" variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<form onSubmit={onSubmit} className="space-y-6" ref={formRef}>
						<div className="space-y-2">
							<Label htmlFor="title">Título *</Label>
							<Input
								id="title"
								name="title"
								placeholder="Digite o título da sua anotação..."
								required
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="content">Conteúdo *</Label>
							<Textarea
								id="content"
								name="content"
								placeholder="Escreva o conteúdo da sua anotação..."
								rows={12}
								required
								value={content}
								onChange={(e) => setContent(e.target.value)}
							/>
						</div>

						<TagsInput value={tags} onChange={setTags} />

						<PublicSwitch value={isPublic} onChange={setIsPublic} />

						<div className="flex items-center space-x-4 pt-4">
							<Button disabled={pending} type="submit">
								{pending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Salvando sua anotação, aguarde...
									</>
								) : (
									"Salvar Anotação"
								)}
							</Button>
							<Button
								type="button"
								variant="outline"
								disabled={!isClearButtonEnabled}
								onClick={handleClear}
								className={
									isClearButtonEnabled
										? "hover:cursor-pointer"
										: "hover:cursor-not-allowed"
								}
							>
								Limpar
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
