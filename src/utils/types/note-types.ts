export type Note = {
	id?: string;
	title: string;
	content: string;
	is_public: boolean;
	tags: string[];
	created_at?: string;
	updated_at?: string;
};

export type SearchOptions = {
	searchInTitle?: boolean;
	searchInContent?: boolean;
	searchInTags?: boolean;
	isPublicOnly?: boolean;
	limit?: number;
};

export type ErrorResponseOptions = {
	error?: boolean;
	message?: string;
	error_description?: string;
};
