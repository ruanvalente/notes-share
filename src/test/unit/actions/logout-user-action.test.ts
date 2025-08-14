import { beforeEach, describe, expect, it, vi } from "vitest";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

import { logoutUserAction } from "@/actions/logout-user-action";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LOGOUT_ERROR_MESSAGES } from "@/utils/constants/messages";

vi.mock("@/lib/supabase/server", () => ({
	createSupabaseServerClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	redirect: vi.fn(),
}));

type TestCaseErrorResponseType = { message: string };
type TestCaseError = { error: TestCaseErrorResponseType | null };
type TestCase = {
	name: string;
	signOutResult: TestCaseError;
	expectedRedirect: string;
	expectErrorLog?: boolean;
};

describe("logoutUserAction", () => {
	let mockSignOut: ReturnType<typeof vi.fn>;
	let mockRedirect: ReturnType<typeof vi.fn>;
	beforeEach(() => {
		vi.clearAllMocks();

		mockSignOut = vi.fn();
		mockRedirect = vi.mocked(redirect);

		vi.mocked(createSupabaseServerClient).mockImplementation(
			async () =>
				({
					auth: { signOut: mockSignOut },
				} as unknown as SupabaseClient)
		);
	});

	const cases: TestCase[] = [
		{
			name: "redirects to /auth/login when no error occurs",
			signOutResult: { error: null },
			expectedRedirect: "/auth/login",
		},
		{
			name: "logs error and redirects with error message when signOut fails",
			signOutResult: { error: { message: "Logout error" } },
			expectedRedirect: `/auth/login?error=${encodeURIComponent(
				LOGOUT_ERROR_MESSAGES.FAILED_LOGOUT
			)}`,
			expectErrorLog: true,
		},
	];

	cases.forEach(({ name, signOutResult, expectedRedirect, expectErrorLog }) => {
		it(name, async () => {
			const mockConsoleError = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			mockSignOut.mockResolvedValueOnce(signOutResult);

			await logoutUserAction();

			expect(mockSignOut).toHaveBeenCalledTimes(1);
			expect(mockRedirect).toHaveBeenCalledWith(expectedRedirect);

			if (expectErrorLog) {
				expect(mockConsoleError).toHaveBeenCalledWith(
					`${LOGOUT_ERROR_MESSAGES.FAILED_LOGOUT}:`,
					signOutResult.error!.message
				);
			} else {
				expect(mockConsoleError).not.toHaveBeenCalled();
			}

			mockConsoleError.mockRestore();
		});
	});
});
