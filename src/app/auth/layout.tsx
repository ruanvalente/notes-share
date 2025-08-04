import { PageTransitionWrapper } from "@/components/wrappers/page-transition";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <PageTransitionWrapper>{children}</PageTransitionWrapper>;
}
