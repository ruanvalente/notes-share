"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";

interface TagsInputProps {
	value?: string[];
	defaultTags?: string[];
	onChange?: (tags: string[]) => void;
}

export function TagsInput({
	value = [],
	defaultTags = [],
	onChange,
}: TagsInputProps) {
	const [tags, setTags] = useState<string[]>(
		value.length > 0 ? value : defaultTags
	);
	const [newTag, setNewTag] = useState("");

	useEffect(() => {
		setTags(value);
	}, [value]);

	const handleAddTag = () => {
		const trimmedTag = newTag.trim();
		if (trimmedTag && !tags.includes(trimmedTag)) {
			const updated = [...tags, trimmedTag];
			setTags(updated);
			onChange?.(updated);
			setNewTag("");
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		const updated = tags.filter((tag) => tag !== tagToRemove);
		setTags(updated);
		onChange?.(updated);
	};

	const isAddButtonDisabled = newTag.trim() === "";

	return (
		<div className="space-y-2">
			<Label>Tags</Label>
			<div className="flex space-x-2">
				<Input
					placeholder="Adicionar tag..."
					value={newTag}
					onChange={(e) => setNewTag(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							handleAddTag();
						}
					}}
				/>
				<Button
					type="button"
					onClick={handleAddTag}
					variant="outline"
					disabled={isAddButtonDisabled}
					className={isAddButtonDisabled ? "cursor-not-allowed" : ""}
				>
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
	);
}
