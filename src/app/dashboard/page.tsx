import { ClientDashboard } from "@/components/shared/client-dashboard";
import { getAllNotes } from "@/service";

export default async function DashboardPage() {
	const notes = await getAllNotes();
	return <ClientDashboard notes={notes} />;
}
