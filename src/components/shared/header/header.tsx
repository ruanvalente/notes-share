import { logoutUserAction } from "@/actions";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/server";
import { FileText, LogOut, Menu, User } from "lucide-react";
import Link from "next/link";

export async function Header() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const userName =
		typeof user?.user_metadata?.full_name === "string"
			? user.user_metadata.full_name
			: "Convidado";

	return (
		<header className="border-b bg-white/80 backdrop-blur-sm">
			<div className="container mx-auto px-4 py-4 flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<Link className="flex gap-2 sm:gap-4" href="/dashboard" prefetch>
						<FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
						<h1 className="text-lg sm:text-2xl font-bold text-gray-900">
							<span className="hidden sm:inline">NotesShare</span>
							<span className="sm:hidden">Notes</span>
						</h1>
					</Link>
				</div>

				<div className="hidden md:flex items-center justify-center space-x-4">
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
								className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors duration-200 hover:cursor-pointer"
							>
								<LogOut className="h-5 w-5" />
								<span>Sair</span>
							</Button>
						</form>
					</div>
				</div>

				<div className="md:hidden">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
							>
								<Menu className="h-5 w-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuItem
								disabled
								className="flex items-center space-x-2 px-4"
							>
								<User className="h-4 w-4" />
								<span className="truncate">{userName}</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<form action={logoutUserAction} className="w-full">
									<Button
										type="submit"
										variant="ghost"
										size="sm"
										className="w-full justify-start flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors duration-200 h-auto p-2"
									>
										<LogOut className="h-4 w-4" />
										<span>Sair</span>
									</Button>
								</form>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
