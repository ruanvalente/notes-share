"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PublicSwitchProps {
	defaultChecked?: boolean;
}

export function PublicSwitch({ defaultChecked = false }: PublicSwitchProps) {
	const [isPublic, setIsPublic] = useState(defaultChecked);

	return (
		<div className="space-y-2">
			<div className="flex items-center space-x-2">
				<Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
				<Label htmlFor="public">Tornar esta anotação pública</Label>
			</div>

			{/* Hidden input para enviar valor no form */}
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
