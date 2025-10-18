import RequestStatusBadge from "@/components/request-status-badge";
import {
	Dashboard,
	DashboardContent,
	DashboardHeader,
	DashboardTitle,
} from "@/components/ui/dashboard";
import { DataTable } from "@/components/ui/data-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { orpc } from "@/utils/orpc";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { EllipsisVertical } from "lucide-react";
import UpdateRequestStatus from "./-update-status";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute(
	"/dashboard/organizations/$organizationId/vacancies/$vacancyId/",
)({
	component: RouteComponent,
	async loader({ params }) {
		return {
			requests: await orpc.requests.getCompany.call(params),
		};
	},
});

function RouteComponent() {
	const { requests: initialData } = Route.useLoaderData();
	const params = Route.useParams();

	const { data: requests } = useQuery(
		orpc.requests.getCompany.queryOptions({
			input: params,
			initialData,
		}),
	);

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
						{
							id: "actions",
							header: "",
							cell: ({ row: { original: request } }) => (
								<div className="flex items-center justify-end">
									<DropdownMenu>
										<DropdownMenuTrigger>
											<EllipsisVertical />
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<UpdateRequestStatus
												status="ACCEPTED"
												request={request}
											/>
											<UpdateRequestStatus
												status="REJECTED"
												request={request}
											/>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							),
						},
					]}
					data={requests}
				/>
			</DashboardContent>
		</Dashboard>
	);
}
