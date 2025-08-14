import { beforeEach, describe, expect, it, vi } from "vitest";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

import { loginUserAction } from "@/actions/login-user-action";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LOGIN_ERROR_MESSAGES } from "@/utils/constants/messages";
import { checkIsValidEmail } from "@/utils/validations";

vi.mock("@/lib/supabase/server", () => ({
	createSupabaseServerClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	redirect: vi.fn(),
}));

vi.mock("@/utils/validations", () => ({
	checkIsValidEmail: vi.fn(),
}));

type SupabaseSignInResult = { error: { message: string } | null };
type TestCase = {
	name: string;
	formData: FormData;
	mockSignInResult?: SupabaseSignInResult;
	mockEmailValid?: boolean;
	expectedError?: string;
	expectedRedirect?: string;
};

describe("loginUserAction", () => {
	let mockSignInWithPassword: ReturnType<typeof vi.fn>;
	let mockRedirect: ReturnType<typeof vi.mocked<typeof redirect>>;

	beforeEach(() => {
		vi.clearAllMocks();

		mockSignInWithPassword = vi.fn();

		mockRedirect = vi.mocked(redirect);

		vi.mocked(createSupabaseServerClient).mockImplementation(
			async () =>
				({
					auth: { signInWithPassword: mockSignInWithPassword },
				} as unknown as SupabaseClient)
		);

		vi.mocked(checkIsValidEmail).mockReturnValue(true);
	});

	const cases: TestCase[] = [
		{
			name: "returns error when email or password is missing",
			formData: new FormData(),
			expectedError: LOGIN_ERROR_MESSAGES.REQUIRED_FIELDS,
		},
		{
			name: "returns error when email is invalid",
			formData: (() => {
				const fd = new FormData();
				fd.set("email", "invalid-email");
				fd.set("password", "123456");
				return fd;
			})(),
			mockEmailValid: false,
			expectedError: LOGIN_ERROR_MESSAGES.INVALID_EMAIL,
		},
		{
			name: "returns authentication failed when credentials are invalid",
			formData: (() => {
				const fd = new FormData();
				fd.set("email", "user@test.com");
				fd.set("password", "wrongpass");
				return fd;
			})(),
			mockSignInResult: { error: { message: "Invalid login credentials" } },
			expectedError: LOGIN_ERROR_MESSAGES.AUTHENTICATION_FAILED,
		},
		{
			name: "returns email not confirmed error",
			formData: (() => {
				const fd = new FormData();
				fd.set("email", "user@test.com");
				fd.set("password", "123456");
				return fd;
			})(),
			mockSignInResult: { error: { message: "Email not confirmed" } },
			expectedError: LOGIN_ERROR_MESSAGES.EMAIL_NOT_CONFIRMED,
		},
		{
			name: "redirects to /dashboard on successful login",
			formData: (() => {
				const fd = new FormData();
				fd.set("email", "user@test.com");
				fd.set("password", "123456");
				return fd;
			})(),
			mockSignInResult: { error: null },
			expectedRedirect: "/dashboard",
		},
	];

	cases.forEach(
		({
			name,
			formData,
			mockSignInResult,
			mockEmailValid,
			expectedError,
			expectedRedirect,
		}) => {
			it(name, async () => {
				if (mockEmailValid !== undefined) {
					vi.mocked(checkIsValidEmail).mockReturnValue(mockEmailValid);
				}

				if (mockSignInResult) {
					mockSignInWithPassword.mockResolvedValueOnce(mockSignInResult);
				}

				const result = await loginUserAction(formData);

				if (expectedError) {
					expect(result).toEqual({ error: expectedError });
					expect(mockRedirect).not.toHaveBeenCalled();
				}

				if (expectedRedirect) {
					expect(mockRedirect).toHaveBeenCalledWith(expectedRedirect);
				}
			});
		}
	);
});
