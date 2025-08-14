import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as crypto from "crypto";
import { generatePublicNoteLinkAction } from "@/actions/generate-public-note-link-action";
import { createSupabaseServerClient } from "@/lib/supabase/server";

vi.mock("crypto");
vi.mock("@/lib/supabase/server", () => ({
	createSupabaseServerClient: vi.fn(),
}));

describe("generatePublicNoteLinkAction", () => {
	const mockNoteId = "test-note-id-123";
	const mockToken = "abcdef1234567890";
	const originalEnv = process.env.NEXT_PUBLIC_BASE_URL;

	const mockSupabase = {
		from: vi.fn(),
		update: vi.fn(),
		eq: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();

		mockSupabase.from.mockReturnValue(mockSupabase);
		mockSupabase.update.mockReturnValue(mockSupabase);
		mockSupabase.eq.mockResolvedValue({ error: null });

		vi.mocked(createSupabaseServerClient).mockResolvedValue(mockSupabase);

		process.env.NEXT_PUBLIC_BASE_URL = "https://example.com";
	});

	afterEach(() => {
		process.env.NEXT_PUBLIC_BASE_URL = originalEnv;
		vi.restoreAllMocks();
	});

	it("should generate a valid public link when the operation succeeds", async () => {
		vi.mocked(crypto.randomBytes).mockReturnValue(
			Buffer.from(mockToken, "hex")
		);

		const result = await generatePublicNoteLinkAction(mockNoteId);

		expect(crypto.randomBytes).toHaveBeenCalledWith(16);
		expect(result).toBe(
			`https://example.com/public/notes/${mockNoteId}?token=${mockToken}`
		);
	});

	it("should create a 32-character hexadecimal token", async () => {
		vi.mocked(crypto.randomBytes).mockReturnValue(
			Buffer.from(mockToken, "hex")
		);

		await generatePublicNoteLinkAction(mockNoteId);

		expect(crypto.randomBytes).toHaveBeenCalledWith(16);
	});

	it("should set expiration date 24 hours in the future", async () => {
		vi.mocked(crypto.randomBytes).mockReturnValue(
			Buffer.from(mockToken, "hex")
		);

		const fixedDate = new Date("2024-01-01T10:00:00Z").getTime();
		vi.spyOn(Date, "now").mockReturnValue(fixedDate);

		const expectedExpiresAt = new Date(
			Date.now() + 24 * 60 * 60 * 1000
		).toISOString();

		await generatePublicNoteLinkAction(mockNoteId);

		expect(mockSupabase.update).toHaveBeenCalledWith({
			public_token: mockToken,
			public_token_expires_at: expectedExpiresAt,
		});
	});

	it("should update the note in the database with token and expiration date", async () => {
		vi.mocked(crypto.randomBytes).mockReturnValue(
			Buffer.from(mockToken, "hex")
		);

		await generatePublicNoteLinkAction(mockNoteId);

		expect(mockSupabase.from).toHaveBeenCalledWith("notes");
		expect(mockSupabase.update).toHaveBeenCalledWith({
			public_token: mockToken,
			public_token_expires_at: expect.any(String),
		});
		expect(mockSupabase.eq).toHaveBeenCalledWith("id", mockNoteId);
	});

	it("should throw an error when database update fails", async () => {
		vi.mocked(crypto.randomBytes).mockReturnValue(
			Buffer.from(mockToken, "hex")
		);

		const errorMessage = "Database connection failed";
		mockSupabase.eq.mockResolvedValue({
			error: { message: errorMessage },
		});

		await expect(generatePublicNoteLinkAction(mockNoteId)).rejects.toThrow(
			errorMessage
		);
	});

	it("should work with different note IDs", async () => {
		vi.mocked(crypto.randomBytes).mockReturnValue(
			Buffer.from(mockToken, "hex")
		);

		const differentNoteId = "different-note-id";

		const result = await generatePublicNoteLinkAction(differentNoteId);

		expect(result).toBe(
			`https://example.com/public/notes/${differentNoteId}?token=${mockToken}`
		);
		expect(mockSupabase.eq).toHaveBeenCalledWith("id", differentNoteId);
	});

	it("should use the correct base URL from the environment", async () => {
		vi.mocked(crypto.randomBytes).mockReturnValue(
			Buffer.from(mockToken, "hex")
		);

		process.env.NEXT_PUBLIC_BASE_URL = "https://custom-domain.com";

		const result = await generatePublicNoteLinkAction(mockNoteId);

		expect(result).toBe(
			`https://custom-domain.com/public/notes/${mockNoteId}?token=${mockToken}`
		);
	});

	it("should generate unique tokens for each call", async () => {
		const token1 = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";
		const token2 = "f1e2d3c4b5a697887766554433221100";

		vi.mocked(crypto.randomBytes)
			.mockReturnValueOnce(Buffer.from(token1, "hex"))
			.mockReturnValueOnce(Buffer.from(token2, "hex"));

		const result1 = await generatePublicNoteLinkAction(mockNoteId);
		const result2 = await generatePublicNoteLinkAction(mockNoteId);

		expect(result1).toContain(`token=${token1}`);
		expect(result2).toContain(`token=${token2}`);
		expect(result1).not.toBe(result2);
	});

	it("should validate that the expiration date is in ISO format", async () => {
		vi.mocked(crypto.randomBytes).mockReturnValue(
			Buffer.from(mockToken, "hex")
		);

		await generatePublicNoteLinkAction(mockNoteId);

		const updateCall = mockSupabase.update.mock.calls[0][0];
		const expiresAt = updateCall.public_token_expires_at;

		expect(new Date(expiresAt).toISOString()).toBe(expiresAt);
		expect(expiresAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
	});

	it("should correctly calculate expiration time (24 hours)", async () => {
		vi.mocked(crypto.randomBytes).mockReturnValue(
			Buffer.from(mockToken, "hex")
		);

		const now = Date.now();

		await generatePublicNoteLinkAction(mockNoteId);

		const updateCall = mockSupabase.update.mock.calls[0][0];
		const expiresAt = new Date(updateCall.public_token_expires_at);
		const expectedExpiresAt = new Date(now + 24 * 60 * 60 * 1000);

		expect(expiresAt.getTime()).toBe(expectedExpiresAt.getTime());
	});
});
