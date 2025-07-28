import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "NotesShare - Suas anotações, organizadas e compartilháveis",
	description:
		"Crie, organize e compartilhe suas anotações pessoais de forma segura. Mantenha suas ideias privadas ou compartilhe com o mundo.",
	keywords: [
		"anotações",
		"notas",
		"organização",
		"compartilhamento",
		"privacidade",
		"NotesShare",
	],
	authors: [
		{ name: "Ruan Valente", url: "https://notes-share-bay.vercel.app" },
	],
	openGraph: {
		title: "NotesShare - Suas anotações, organizadas e compartilháveis",
		description:
			"Crie, organize e compartilhe suas anotações pessoais de forma segura. Mantenha suas ideias privadas ou compartilhe com o mundo.",
		url: "https://notes-share-bay.vercel.app/",
		type: "website",
		images: [
			{
				url: "https://notes-share.vercel.app/og-image.png",
				width: 1200,
				height: 630,
				alt: "NotesShare",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "NotesShare - Suas anotações, organizadas e compartilháveis",
		description:
			"Crie, organize e compartilhe suas anotações pessoais de forma segura. Mantenha suas ideias privadas ou compartilhe com o mundo.",
		images: ["https://notes-share.vercel.app/og-image.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
					{children}
				</main>
				<footer>
					<div className="container mx-auto px-4 py-8 text-center text-gray-600">
						<p>
							&copy; {new Date().getFullYear()} NotesShare. Todos os direitos
							reservados.
						</p>
						<p>
							Feito com <span className="text-red-500">♥</span> por{" "}
							<Link
								target="_blank"
								href="https://ruanvalente-portfolio.vercel.app/"
								className="text-blue-600 hover:underline"
							>
								Ruan Valente
							</Link>
						</p>
					</div>
				</footer>
			</body>
		</html>
	);
}
