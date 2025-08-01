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

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - /api (API routes)
		 * - /_next/static (static files)
		 * - /_next/image (image optimization files)
		 * - /favicon.ico (favicon file)
		 * - Public routes defined above
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|login|register|forgot|auth/callback|reset-password).*)",
	],
};
