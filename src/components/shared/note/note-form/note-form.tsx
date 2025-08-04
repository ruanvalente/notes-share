"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";

export function NoteForm() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isPublic, setIsPublic] = useState(false);
	const [tags, setTags] = useState<string[]>([]);
	const [newTag, setNewTag] = useState("");

	const handleAddTag = () => {
		if (newTag.trim() && !tags.includes(newTag.trim())) {
			setTags([...tags, newTag.trim()]);
			setNewTag("");
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implementar lógica de salvamento
		console.log("Save note:", { title, content, isPublic, tags });
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Detalhes da Anotação</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Título */}
					<div className="space-y-2">
						<Label htmlFor="title">Título</Label>
						<Input
							id="title"
							placeholder="Digite o título da sua anotação..."
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
					</div>

					{/* Conteúdo */}
					<div className="space-y-2">
						<Label htmlFor="content">Conteúdo</Label>
						<Textarea
							id="content"
							placeholder="Escreva o conteúdo da sua anotação..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
							rows={12}
							required
						/>
					</div>

					{/* Tags */}
					<div className="space-y-2">
						<Label>Tags</Label>
						<div className="flex space-x-2">
							<Input
								placeholder="Adicionar tag..."
								value={newTag}
								onChange={(e) => setNewTag(e.target.value)}
								onKeyPress={(e) =>
									e.key === "Enter" && (e.preventDefault(), handleAddTag())
								}
							/>
							<Button type="button" onClick={handleAddTag} variant="outline">
								<Plus className="h-4 w-4" />
							</Button>
						</div>
						{tags.length > 0 && (
							<div className="flex flex-wrap gap-2 mt-2">
								{tags.map((tag) => (
									<Badge
										key={tag}
										variant="secondary"
										className="flex items-center space-x-1"
									>
										<span>{tag}</span>
										<button
											type="button"
											onClick={() => handleRemoveTag(tag)}
											className="ml-1 hover:text-red-600"
										>
											<X className="h-3 w-3" />
										</button>
									</Badge>
								))}
							</div>
						)}
					</div>

					{/* Visibilidade */}
					<div className="flex items-center space-x-2">
						<Switch
							id="public"
							checked={isPublic}
							onCheckedChange={setIsPublic}
						/>
						<Label htmlFor="public">Tornar esta anotação pública</Label>
					</div>
					{isPublic && (
						<p className="text-sm text-gray-600">
							Anotações públicas podem ser compartilhadas via link e
							visualizadas por outros usuários.
						</p>
					)}

					{/* Botões */}
					<div className="flex items-center space-x-4 pt-4">
						<Button type="submit">Salvar Anotação</Button>
						<Button type="button" variant="outline">
							Cancelar
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
