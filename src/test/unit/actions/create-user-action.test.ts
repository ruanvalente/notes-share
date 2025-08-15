import { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createUserAction } from "@/actions/create-user-action";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CREATE_USER_ERROR_MESSAGES } from "@/utils/constants/messages";
import * as validations from "@/utils/validations";

vi.mock("@/lib/supabase/server", () => ({
	createSupabaseServerClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	redirect: vi.fn(),
}));

describe("createUserAction", () => {
	const mockSupabase = {
		auth: { signUp: vi.fn() },
	};

	const baseFormData = {
		name: "John Doe",
		email: "john@example.com",
		password: "ValidPass123",
		confirmPassword: "ValidPass123",
	};

	const getFormData = (overrides: Partial<typeof baseFormData> = {}) => {
		const fd = new FormData();
		const merged = { ...baseFormData, ...overrides };
		for (const [key, value] of Object.entries(merged)) {
			fd.set(key, value as string);
		}
		return fd;
	};

	beforeEach(() => {
		vi.clearAllMocks();

		vi.mocked(createSupabaseServerClient).mockResolvedValue(
			mockSupabase as unknown as SupabaseClient
		);

		vi.spyOn(validations, "checkIsValidEmail").mockReturnValue(true);
		vi.spyOn(validations, "checkIsValidPassword").mockReturnValue(true);
		vi.spyOn(validations, "checkArePasswordsMatching").mockReturnValue(true);
		vi.spyOn(validations, "checkIsValidName").mockReturnValue(true);
		vi.spyOn(validations, "handleSanitizedName").mockImplementation((n) => n);

		mockSupabase.auth.signUp.mockResolvedValue({ error: null });
	});

	it("should redirect with error when required fields are missing", async () => {
		const fd = getFormData({ name: "" });
		await createUserAction(fd);
		expect(redirect).toHaveBeenCalledWith(
			`/auth/register?error=${encodeURIComponent(
				CREATE_USER_ERROR_MESSAGES.REQUIRED_FIELDS
			)}`
		);
	});

	it("should redirect with error when email is invalid", async () => {
		vi.mocked(validations.checkIsValidEmail).mockReturnValue(false);
		const fd = getFormData();
		await createUserAction(fd);
		expect(redirect).toHaveBeenCalledWith(
			`/auth/register?error=${encodeURIComponent(
				CREATE_USER_ERROR_MESSAGES.INVALID_EMAIL
			)}`
		);
	});

	it("should redirect with error when password is invalid", async () => {
		vi.mocked(validations.checkIsValidPassword).mockReturnValue(false);
		const fd = getFormData();
		await createUserAction(fd);
		expect(redirect).toHaveBeenCalledWith(
			`/auth/register?error=${encodeURIComponent(
				CREATE_USER_ERROR_MESSAGES.INVALID_PASSWORD
			)}`
		);
	});

	it("should redirect with error when passwords do not match", async () => {
		vi.mocked(validations.checkArePasswordsMatching).mockReturnValue(false);
		const fd = getFormData();
		await createUserAction(fd);
		expect(redirect).toHaveBeenCalledWith(
			`/auth/register?error=${encodeURIComponent(
				CREATE_USER_ERROR_MESSAGES.PASSWORDS_NOT_MATCHING
			)}`
		);
	});

	it("should redirect with error when name is invalid and length is out of bounds", async () => {
		vi.mocked(validations.checkIsValidName).mockReturnValue(false);
		const fd = getFormData({ name: "A" });
		await createUserAction(fd);
		expect(redirect).toHaveBeenCalledWith(
			`/auth/register?error=${encodeURIComponent(
				CREATE_USER_ERROR_MESSAGES.INVALID_NAME
			)}`
		);
	});

	it("should call Supabase signUp with sanitized name", async () => {
		const sanitized = "Sanitized Name";
		vi.mocked(validations.handleSanitizedName).mockReturnValue(sanitized);
		const fd = getFormData();
		await createUserAction(fd);
		expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
			email: baseFormData.email,
			password: baseFormData.password,
			options: {
				data: { full_name: sanitized },
				emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
			},
		});
	});

	it("should redirect with ACCOUNT_ALREADY_EXISTS when Supabase returns duplicate user error", async () => {
		mockSupabase.auth.signUp.mockResolvedValue({
			error: { message: "User already registered" },
		});
		const fd = getFormData();
		await createUserAction(fd);
		expect(redirect).toHaveBeenCalledWith(
			`/auth/register?error=${encodeURIComponent(
				CREATE_USER_ERROR_MESSAGES.ACCOUNT_ALREADY_EXISTS
			)}`
		);
	});

	it("should redirect with DATABASE_ERROR when Supabase returns database error", async () => {
		mockSupabase.auth.signUp.mockResolvedValue({
			error: { message: "Database error saving new user" },
		});
		const fd = getFormData();
		await createUserAction(fd);
		expect(redirect).toHaveBeenCalledWith(
			`/auth/register?error=${encodeURIComponent(
				CREATE_USER_ERROR_MESSAGES.DATABASE_ERROR
			)}`
		);
	});

	it("should redirect with FAILED_CREATE_ACCOUNT for other Supabase errors", async () => {
		mockSupabase.auth.signUp.mockResolvedValue({
			error: { message: "Some unknown error" },
		});
		const fd = getFormData();
		await createUserAction(fd);
		expect(redirect).toHaveBeenCalledWith(
			`/auth/register?error=${encodeURIComponent(
				CREATE_USER_ERROR_MESSAGES.FAILED_CREATE_ACCOUNT
			)}`
		);
	});

	it("should redirect with success message when account is created", async () => {
		const fd = getFormData();
		await createUserAction(fd);
		expect(redirect).toHaveBeenCalledWith(
			`/auth/register?success=${encodeURIComponent(
				CREATE_USER_ERROR_MESSAGES.CREATE_ACCOUNT_SUCCESS
			)}`
		);
	});
});
