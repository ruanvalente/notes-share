import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function EmptyNote() {
	return (
		<div className="text-center py-12">
			<div className="text-gray-400 mb-4">
				<Plus className="h-16 w-16 mx-auto" />
			</div>
			<h3 className="text-lg font-medium text-gray-900 mb-2">
				Nenhuma anotação encontrada
			</h3>
			<p className="text-gray-600 mb-4">Comece criando sua primeira anotação</p>
			<Link href="/notes/create" prefetch>
				<Button className="cursor-pointer">Criar primeira anotação</Button>
			</Link>
		</div>
	);
}
