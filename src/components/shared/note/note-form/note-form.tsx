"use client";

import { useRouter } from "next/navigation";

import { createNoteAction } from "@/actions/";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { PublicSwitch } from "../public-switch";
import { TagsInput } from "../tags-input";

export function NoteForm() {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const handleCreateNote = async (formData: FormData) => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await createNoteAction(formData);
			if (result?.error) {
				setError(result.error);
				return;
			}
			router.push("/dashboard");
		} catch (error) {
			console.log("error", error);
			setIsLoading(false);
		} finally {
			setIsLoading(false);
		}
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

					<form action={handleCreateNote} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="title">Título *</Label>
							<Input
								id="title"
								name="title"
								placeholder="Digite o título da sua anotação..."
								defaultValue={""}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="content">Conteúdo *</Label>
							<Textarea
								id="content"
								name="content"
								placeholder="Escreva o conteúdo da sua anotação..."
								defaultValue={""}
								rows={12}
								required
							/>
						</div>

						<TagsInput defaultTags={[]} />

						<PublicSwitch defaultChecked={false} />

						<div className="flex items-center space-x-4 pt-4">
							<Button disabled={isLoading} type="submit">
								Salvar Anotação
							</Button>
							<Button type="button" variant="outline">
								Limpar
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
