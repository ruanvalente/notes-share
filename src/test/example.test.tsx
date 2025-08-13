import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Link from "next/link";

export default function Page() {
	return (
		<div>
			<h1>Home</h1>
			<Link href="/about">About</Link>
		</div>
	);
}

test("<Page />", () => {
	render(<Page />);
	expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined();
});
