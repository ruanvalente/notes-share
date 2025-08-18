"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type PublicSwitchProps = {
	value?: boolean;
	defaultChecked?: boolean;
	onChange?: (checked: boolean) => void;
};

export function PublicSwitch({
	value,
	defaultChecked = false,
	onChange,
}: PublicSwitchProps) {
	const [checked, setChecked] = useState(value ?? defaultChecked);

	useEffect(() => {
		if (value !== undefined) setChecked(value);
	}, [value]);

	const handleCheckedChange = (newChecked: boolean) => {
		setChecked(newChecked);
		onChange?.(newChecked);
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center space-x-2">
				<Switch
					id="public"
					checked={checked}
					onCheckedChange={handleCheckedChange}
				/>
				<Label htmlFor="public">Tornar esta anotação pública</Label>
			</div>

			<input type="hidden" name="isPublic" value={checked.toString()} />

			{checked && (
				<strong>
					<p className="text-sm text-gray-600">
						Anotações públicas podem ser compartilhadas via link e visualizadas
						por outros usuários.
					</p>
				</strong>
			)}
		</div>
	);
}
