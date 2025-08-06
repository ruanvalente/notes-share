"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface TagsInputProps {
	defaultTags?: string[];
}

export function TagsInput({ defaultTags = [] }: TagsInputProps) {
	const [tags, setTags] = useState<string[]>(defaultTags);
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

	return (
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

			{/* Hidden input para enviar tags no form */}
			<input type="hidden" name="tags" value={tags.join(",")} />

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
	);
}
