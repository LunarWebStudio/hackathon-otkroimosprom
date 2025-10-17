import Search from "@/components/search";
import {
	Dashboard,
	DashboardContent,
	DashboardHeader,
	DashboardTitle,
	DashboardTitleText,
} from "@/components/ui/dashboard";
import { format } from "date-fns";
import {
	DataTable,
	FilterableHeader,
	ResetFiltersButton,
} from "@/components/ui/data-table";
import type { User } from "@/lib/types/user";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { UserRoleSchema } from "@lunarweb/shared/schemas";
import z from "zod/v4";
import { userRoleNames, type UserRole } from "@lunarweb/shared/types";
import UserRoleBadge from "@/components/role-badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import UpdateUser from "./-update";
import { useQuery } from "@tanstack/react-query";
import { BreadcrumbDynamic } from "@/components/ui/breadcrumb";
import { userRolesEnum } from "../../../../../../../packages/database/src/schema/auth";

export const Route = createFileRoute("/dashboard/admin/users/")({
	component: RouteComponent,
	validateSearch: z
		.object({
			roles: UserRoleSchema.array().optional(),
		})
		.nullish()
		.default({}),
	async loader({ context }) {
		return {
			users: await context.orpc.user.get.call(),
		};
	},
});

function RouteComponent() {
	const { users: initialData } = Route.useLoaderData();
	const [search, setSearch] = useState("");
	const { orpc } = Route.useRouteContext();

	const { data: users } = useQuery(
		orpc.user.get.queryOptions({
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
		header: (opts) => {
			return (
				<FilterableHeader
					values={userRolesEnum.enumValues.map((v) => ({
						id: v,
						name: userRoleNames[v],
					}))}
					searchKey="roles"
					{...opts}
				>
					Роль
				</FilterableHeader>
			);
		},
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
			return (
				<div className="flex items-center justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<EllipsisVertical />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<UpdateUser user={user} />
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
