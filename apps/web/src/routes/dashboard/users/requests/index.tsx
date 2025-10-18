import RequestStatusBadge from "@/components/request-status-badge";
import {
	Dashboard,
	DashboardContent,
	DashboardHeader,
	DashboardTitle,
} from "@/components/ui/dashboard";
import { DataTable } from "@/components/ui/data-table";
import { orpc } from "@/utils/orpc";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";

export const Route = createFileRoute("/dashboard/users/requests/")({
	component: RouteComponent,
	async loader() {
		return {
			requests: await orpc.requests.getStudent.call(),
		};
	},
});

function RouteComponent() {
	const { requests } = Route.useLoaderData();
	return (
		<Dashboard>
			<DashboardHeader>
				<DashboardTitle hideNavigation>Отклики</DashboardTitle>
			</DashboardHeader>
			<DashboardContent>
				<DataTable
					columns={[
						{
							accessorKey: "serial",
							header: "ID",
						},
						{
							accessorKey: "vacancy.name",
							header: "Вакансия",
						},
						{
							accessorKey: "organization.name",
							header: "Компания",
						},
						{
							accessorKey: "status",
							header: "Статус",
							cell: ({ row }) => (
								<RequestStatusBadge status={row.original.status} />
							),
						},
						{
							accessorKey: "createdAt",
							header: "Дата отклика",
							cell: ({ row }) => format(row.original.createdAt, "dd.MM.yyyy"),
						},
					]}
					data={requests}
				/>
			</DashboardContent>
		</Dashboard>
	);
}
