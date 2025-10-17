import Search from "@/components/search";
import {
	Dashboard,
	DashboardContent,
	DashboardHeader,
	DashboardTitle,
	DashboardTitleText,
} from "@/components/ui/dashboard";
import { format } from "date-fns";
import { DataTable, ResetFiltersButton } from "@/components/ui/data-table";
import type { User } from "@/lib/types/user";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { type UserRole } from "@lunarweb/shared/types";
import UserRoleBadge from "@/components/role-badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BreadcrumbDynamic } from "@/components/ui/breadcrumb";
import DeleteUser from "@/routes/dashboard/admin/users/-delete";
import CreateEmployee from "./-create";

export const Route = createFileRoute(
	"/dashboard/organizations/$organizationId/employees/",
)({
	component: RouteComponent,
	async loader({ context }) {
		return {
			users: await context.orpc.users.get.call(),
		};
	},
});

function RouteComponent() {
	const { users: initialData } = Route.useLoaderData();
	const [search, setSearch] = useState("");
	const { orpc } = Route.useRouteContext();

	const { data: users } = useQuery(
		orpc.users.get.queryOptions({
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
					<CreateEmployee />
					<Search search={search} setSearch={setSearch} />
				</div>
			</DashboardHeader>
			<DashboardContent>
				<DataTable
					columns={columns}
					data={users.filter((u) => {
						if (!search) return true;
						return [u.name, u.email]
							.map((s) => s.toLowerCase())
							.includes(search.toLowerCase());
					})}
				/>
			</DashboardContent>
		</Dashboard>
	);
}

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "name",
		header: "ФИО",
	},
	{
		accessorKey: "role",
		filterFn: ({ original: { role } }, _, v: string[] | undefined) => {
			if (!v?.length) return true;

			return v.includes(role);
		},
		header: "Роль",
		cell: ({ cell }) => <UserRoleBadge role={cell.getValue() as UserRole} />,
	},
	{
		accessorKey: "email",
		header: "Почта",
	},
	{
		accessorKey: "createdAt",
		header: "Дата регистрации",
		cell: ({ cell }) => format(cell.getValue() as Date, "dd.MM.yyyy"),
	},
	{
		id: "actions",
		header: () => <ResetFiltersButton />,
		cell: ({ row: { original: user } }) => {
			const { session } = Route.useRouteContext();
			return (
				<div className="flex items-center justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<EllipsisVertical />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DeleteUser user={user} disabled={user.id === session?.user.id} />
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
