import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
	const cookieStore = req.cookies;
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll: () => cookieStore.getAll(),
				setAll: () => {},
			},
		}
	);

	const url = req.nextUrl;
	const pathname = url.pathname;

	if (pathname.startsWith("/dashboard/notes/")) {
		const token = url.searchParams.get("token");

		if (token) {
			const { data: note, error } = await supabase
				.from("notes")
				.select("id, is_public, public_token_expires_at")
				.eq("public_token", token)
				.single();

			if (!error && note?.is_public) {
				const now = new Date();
				const expiresAt = note.public_token_expires_at
					? new Date(note.public_token_expires_at)
					: null;

				if (expiresAt && expiresAt > now) {
					return NextResponse.next();
				}
			}

			return NextResponse.redirect(new URL("/auth/fallback", req.url));
		}
	}

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session && pathname.startsWith("/dashboard")) {
		return NextResponse.redirect(new URL("/auth/fallback", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*"],
};
