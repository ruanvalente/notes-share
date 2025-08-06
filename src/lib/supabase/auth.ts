import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./server";

export const getServerSession = cache(async () => {
	const supabase = await createSupabaseServerClient();

	try {
		const {
			data: { session },
			error,
		} = await supabase.auth.getSession();

		if (error) {
			console.error("Erro ao obter sessão:", error);
			return null;
		}

		return session;
	} catch (error) {
		console.error("Erro na verificação de sessão:", error);
		return null;
	}
});

export const getCurrentUser = cache(async (): Promise<User | null> => {
	const session = await getServerSession();
	return session?.user || null;
});

export const isAuthenticated = cache(async (): Promise<boolean> => {
	const session = await getServerSession();
	return !!session?.user;
});

export const getUserProfile = cache(async () => {
	const user = await getCurrentUser();

	if (!user) return null;

	const supabase = await createSupabaseServerClient();

	try {
		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", user.id)
			.single();

		if (error) {
			console.error("Erro ao buscar perfil:", error);
			return null;
		}

		return data;
	} catch (error) {
		console.error("Erro na busca do perfil:", error);
		return null;
	}
});
