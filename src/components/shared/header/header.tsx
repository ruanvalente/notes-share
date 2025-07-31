import { logoutUserAction } from "@/actions/logout-user-action";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { FileText, LogOut, User } from "lucide-react";
import Link from "next/link";

export async function Header() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const userName = user?.user_metadata?.full_name || "Convidado";

	return (
		<header className="border-b bg-white/80 backdrop-blur-sm">
			<div className="container mx-auto px-4 py-4 flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<Link className="flex gap-4" href="/dashboard" prefetch>
						<FileText className="h-8 w-8 text-blue-600" />
						<h1 className="text-2xl font-bold text-gray-900">NotesShare</h1>
					</Link>
				</div>
				<div className="flex items-center justify-center space-x-4">
					<div className="flex items-center space-x-2">
						<Button
							variant="ghost"
							size="sm"
							className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
							disabled
						>
							<User className="h-5 w-5 text-gray-600" />
							<span className="text-gray-900">{userName}</span>
						</Button>
					</div>
					<div className="flex space-x-2">
						<form action={logoutUserAction}>
							<Button
								type="submit"
								variant="ghost"
								size="sm"
								className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
							>
								<LogOut className="h-5 w-5" />
								<span>Sair</span>
							</Button>
						</form>
					</div>
				</div>
			</div>
		</header>
	);
}
