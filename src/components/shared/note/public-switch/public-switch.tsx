"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PublicSwitchProps {
	value?: boolean;
	defaultChecked?: boolean;
	onChange?: (checked: boolean) => void;
}

export function PublicSwitch({
	value,
	defaultChecked = false,
	onChange,
}: PublicSwitchProps) {
	const [isPublic, setIsPublic] = useState(value ?? defaultChecked);

	useEffect(() => {
		setIsPublic(value ?? defaultChecked);
	}, [value, defaultChecked]);

	const handleCheckedChange = (checked: boolean) => {
		setIsPublic(checked);
		onChange?.(checked);
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center space-x-2">
				<Switch
					id="public"
					checked={isPublic}
					onCheckedChange={handleCheckedChange}
				/>
				<Label htmlFor="public">Tornar esta anotação pública</Label>
			</div>

			<input type="hidden" name="isPublic" value={isPublic.toString()} />

			{isPublic && (
				<p className="text-sm text-gray-600">
					Anotações públicas podem ser compartilhadas via link e visualizadas
					por outros usuários.
				</p>
			)}
		</div>
	);
}
