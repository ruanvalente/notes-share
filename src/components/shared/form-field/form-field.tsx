import { Label } from "@radix-ui/react-label";

export function FormField({
	label,
	id,
	error,
	children,
}: {
	label: string;
	id: string;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			{children}
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
}
