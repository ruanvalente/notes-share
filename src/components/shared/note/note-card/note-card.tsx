"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Lock, Globe, Share2, Edit, Trash2 } from "lucide-react";
import { Note } from "@/utils/types/note-types";
import { formatDate } from "@/utils/date/format-date";
import { useNotes } from "@/context";

type NoteCardProps = {
	note: Note;
};

export function NoteCard({ note }: NoteCardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { handleDeleteNote, isPending } = useNotes();

	const truncatedContent =
		note.content.length > 150
			? note.content.substring(0, 150) + "..."
			: note.content;

	return (
		<>
			<Card className="hover:shadow-md hover:scale-105 hover:cursor-pointer transition-all duration-300">
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<CardTitle className="text-lg line-clamp-2">
							<Link
								prefetch
								href={`/dashboard/notes/${note.id}`}
								className="hover:text-blue-600"
							>
								{note.title}
							</Link>
						</CardTitle>
						<div className="flex items-center space-x-1 ml-2">
							{note.is_public ? (
								<Globe className="h-4 w-4 text-green-600" />
							) : (
								<Lock className="h-4 w-4 text-red-600" />
							)}
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					<p className="text-sm text-gray-600 line-clamp-3">
						{truncatedContent}
					</p>

					<div className="flex flex-wrap gap-1">
						{note.tags.slice(0, 3).map((tag) => (
							<Badge key={tag} variant="secondary" className="text-xs">
								{tag}
							</Badge>
						))}
						{note.tags.length > 3 && (
							<Badge variant="secondary" className="text-xs">
								+{note.tags.length - 3}
							</Badge>
						)}
					</div>

					<div className="flex items-center justify-between pt-2 border-t">
						<div className="flex items-center text-xs text-gray-500">
							<Calendar className="h-3 w-3 mr-1" />
							{formatDate(note.created_at as string)}
						</div>

						<div className="flex items-center space-x-1">
							{note.is_public && (
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0 cursor-pointer"
								>
									<Share2 className="h-3 w-3" />
								</Button>
							)}
							<Link prefetch href={`/dashboard/notes/${note.id}`}>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0 cursor-pointer"
								>
									<Edit className="h-3 w-3" />
								</Button>
							</Link>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 text-red-600 hover:text-red-700 cursor-pointer"
								onClick={() => setIsModalOpen(true)}
								disabled={isPending}
							>
								<Trash2 className="h-3 w-3" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirmar Exclusão</DialogTitle>
						<DialogDescription>
							Tem certeza que deseja excluir a nota{" "}
							<strong>{`"${note.title}"`}</strong>? Esta ação não pode ser
							desfeita.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsModalOpen(false)}
							disabled={isPending}
						>
							Cancelar
						</Button>
						<Button
							className="hover:cursor-pointer"
							variant="destructive"
							onClick={() =>
								handleDeleteNote(note.id as string, () => setIsModalOpen(false))
							}
							disabled={isPending}
						>
							{isPending ? "Excluindo..." : "Confirmar"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
