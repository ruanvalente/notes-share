import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function EmptyNoteSkeleton() {
	return (
		<Card className="animate-pulse">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<CardTitle className="w-2/3 h-4 bg-gray-300 rounded" />
					<div className="h-4 w-4 bg-gray-300 rounded-full ml-2" />
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="space-y-2">
					<div className="w-full h-3 bg-gray-300 rounded" />
					<div className="w-5/6 h-3 bg-gray-300 rounded" />
					<div className="w-4/6 h-3 bg-gray-300 rounded" />
				</div>

				<div className="flex flex-wrap gap-1">
					<Badge className="w-12 h-4 bg-gray-300 rounded" />
					<Badge className="w-12 h-4 bg-gray-300 rounded" />
					<Badge className="w-12 h-4 bg-gray-300 rounded" />
				</div>

				<div className="flex items-center justify-between pt-2 border-t">
					{/* Data */}
					<div className="w-20 h-3 bg-gray-300 rounded" />
					<div className="flex items-center space-x-1">
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 bg-gray-300 rounded"
							disabled
						/>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 bg-gray-300 rounded"
							disabled
						/>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 bg-gray-300 rounded"
							disabled
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
