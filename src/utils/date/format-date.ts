export function formatDate(isoDate: string) {
	const date = new Date(isoDate);

	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(date);
}
