import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const type = searchParams.get("type");
	const next = searchParams.get("next") ?? "/";

	if (code) {
		const supabase = await createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			if (type === "recovery") {
				return NextResponse.redirect(`${origin}/reset-password`);
			}
			return NextResponse.redirect(`${origin}${next}`);
		} else {
			const errorMessage = encodeURIComponent(error.message);
			if (type === "recovery") {
				return NextResponse.redirect(
					`${origin}/auth/forgot?error=${errorMessage}`
				);
			}
			return NextResponse.redirect(
				`${origin}/auth/login?error=${errorMessage}`
			);
		}
	}

	return NextResponse.redirect(
		`${origin}/auth/login?error=${encodeURIComponent("Link inválido")}`
	);
}
