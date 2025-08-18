"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

import {
	EmptyNote,
	EmptyNoteSkeleton,
	NoteCard,
} from "@/components/shared/note";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Note } from "@/utils/types/note-types";
import { useNotes } from "@/context";

type ClientDashboardTypeProps = {
	notes: Note[];
};

function NotesList() {
	const { searchTerm, debouncedTerm, filteredNotes } = useNotes();

	const isSearching = searchTerm !== debouncedTerm;
	const isEmpty = filteredNotes.length === 0;

	if (isSearching) return <EmptyNoteSkeleton />;
	if (isEmpty) return <EmptyNote />;

	return (
		<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			{filteredNotes.map((note) => (
				<NoteCard key={note.id} note={note} />
			))}
		</div>
	);
}

export function ClientDashboard({ notes }: ClientDashboardTypeProps) {
	const { searchTerm, setSearchTerm, setNotes } = useNotes();

	useEffect(() => {
		setNotes(notes);
	}, [notes, setNotes]);

	const isSearching = searchTerm.length > 0;

	return (
		<section className="container mx-auto px-4 py-8">
			<div className="flex flex-col items-center justify-between mb-8 md:flex-row">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Minhas Anotações</h1>
					<p className="text-gray-600 mt-2">
						Gerencie e organize suas anotações pessoais
					</p>
				</div>
				<Link
					prefetch
					href="/dashboard/notes/create"
					className="w-full mt-4 md:w-auto md:mt-0 flex justify-end"
				>
					<Button className="flex items-center justify-center md:space-x-2 w-fit md:w-auto rounded-full md:rounded-md hover:cursor-pointer">
						<Plus className="h-4 w-4" />
						<span className="hidden md:inline">Nova Anotação</span>
					</Button>
				</Link>
			</div>

			<div className="relative mb-8 max-w-md mx-auto md:mx-0">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
				<Input
					placeholder={
						isSearching ? "Buscando anotações..." : "Buscar anotações..."
					}
					className="pl-10"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					aria-label="Buscar anotações"
				/>
			</div>

			<NotesList />
		</section>
	);
}
