"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";

type TagsInputProps = {
	value?: string[];
	defaultValue?: string[];
	onChange?: (tags: string[]) => void;
};

export function TagsInput({
	value,
	defaultValue = [],
	onChange,
}: TagsInputProps) {
	const [tags, setTags] = useState(value ?? defaultValue);
	const [input, setInput] = useState("");

	useEffect(() => {
		if (value !== undefined) setTags(value);
	}, [value]);

	const handleAddTag = () => {
		const newTag = input.trim();
		if (newTag && !tags.includes(newTag)) {
			const updated = [...tags, newTag];
			setTags(updated);
			onChange?.(updated);
		}
		setInput("");
	};

	const handleRemoveTag = (tagToRemove: string) => {
		const updated = tags.filter((t) => t !== tagToRemove);
		setTags(updated);
		onChange?.(updated);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddTag();
		}
	};

	return (
		<div className="space-y-2">
			<input
				type="text"
				placeholder="Adicionar tag..."
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
				className="border px-2 py-1 rounded w-full"
			/>
			<div className="flex flex-wrap gap-2">
				{tags.map((tag) => (
					<span
						key={tag}
						className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
					>
						{tag}

						<div
							aria-label="Remover tag"
							className="text-zinc-900 hover:cursor-pointer"
							onClick={() => handleRemoveTag(tag)}
						>
							<X className="h-4 w-4" />
						</div>
					</span>
				))}
			</div>
		</div>
	);
}
