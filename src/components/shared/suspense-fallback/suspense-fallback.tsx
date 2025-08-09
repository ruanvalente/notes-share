export function SuspenseFallback() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
			<p className="text-white text-lg font-medium animate-pulse">
				Carregando...
			</p>
		</div>
	);
}
