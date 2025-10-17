import Search from "@/components/search";
import {
	Dashboard,
	DashboardContent,
	DashboardHeader,
	DashboardTitle,
	DashboardTitleText,
} from "@/components/ui/dashboard";
import { DataTable } from "@/components/ui/data-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Organization } from "@/lib/types/organization";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, SquareArrowOutUpRightIcon } from "lucide-react";
import { useState } from "react";
import UpdateOrganizationStatus from "./-update-status";
import UserorganizationStatusBadge from "@/components/organization-status-badge";
import { BreadcrumbDynamic } from "@/components/ui/breadcrumb";
import OrganizationInfo from "./-info";

export const Route = createFileRoute("/dashboard/admin/organizations/")({
	component: RouteComponent,
	async loader({ context }) {
		return {
			organizations: await context.orpc.organizations.get.call({
				showAll: true,
			}),
		};
	},
});

function RouteComponent() {
	const { organizations: initialData } = Route.useLoaderData();
	const { orpc } = Route.useRouteContext();
	const [search, setSearch] = useState("");

	const { data: organizations } = useQuery(
		orpc.organizations.get.queryOptions({
			input: {
				showAll: true,
			},
			initialData,
		}),
	);

	return (
		<Dashboard>
			<DashboardHeader>
				<DashboardTitle hideNavigation>
					<DashboardTitleText>
						<BreadcrumbDynamic />
					</DashboardTitleText>
				</DashboardTitle>
				<div className="flex items-center gap-2">
					<Search search={search} setSearch={setSearch} />
				</div>
			</DashboardHeader>
			<DashboardContent>
				<DataTable
					columns={columns}
					data={organizations.filter((u) => {
						if (!search) return true;
						return [u.name, u.inn, u.kpp, u.address, u.orgn]
							.map((s) => (s ? s.toLowerCase() : ""))
							.includes(search.toLowerCase());
					})}
				/>
			</DashboardContent>
		</Dashboard>
	);
}

export const columns: ColumnDef<Organization>[] = [
	{
		accessorKey: "name",
		header: "Название",
	},
	{
		accessorKey: "inn",
		header: "ИНН",
	},
	{
		accessorKey: "orgn",
		header: "ОРГН/ОРГНИП",
	},
	{
		accessorKey: "kpp",
		header: "КПП",
	},
	{
		accessorKey: "status",
		header: "Статус",
		cell: ({ row: { original: orginization } }) => (
			<UserorganizationStatusBadge organizationStatus={orginization.status} />
		),
	},
	{
		id: "actions",
		cell: ({ row: { original: organization } }) => {
			return (
				<div className="flex items-center justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<EllipsisVertical />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<OrganizationInfo organization={organization} />
							<UpdateOrganizationStatus
								organization={organization}
								status="APPROVED"
							/>
							<UpdateOrganizationStatus
								organization={organization}
								status="REJECTED"
							/>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
