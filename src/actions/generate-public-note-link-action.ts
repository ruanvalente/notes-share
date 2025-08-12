"use server";

import crypto from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function generatePublicNoteLinkAction(noteId: string) {
	const supabase = await createSupabaseServerClient();

	const token = crypto.randomBytes(16).toString("hex");
	const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

	const { error } = await supabase
		.from("notes")
		.update({
			public_token: token,
			public_token_expires_at: expiresAt.toISOString(),
		})
		.eq("id", noteId);

	if (error) throw new Error(error.message);

	return `${process.env.NEXT_PUBLIC_BASE_URL}/public/notes/${noteId}?token=${token}`;
}
