import { Header } from "@/components/shared/header";
import { PageTransitionWrapper } from "@/components/wrappers/page-transition";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />
			<div className="min-h-screen bg-gray-50">
				<PageTransitionWrapper>{children}</PageTransitionWrapper>
			</div>
		</>
	);
}
