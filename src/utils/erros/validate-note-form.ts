export function validateNoteForm(values: { title: string; content: string }) {
	const errors: { title?: string; content?: string } = {};
	if (!values.title.trim()) errors.title = "Título é obrigatório";
	if (!values.content.trim()) errors.content = "Conteúdo é obrigatório";
	return errors;
}
