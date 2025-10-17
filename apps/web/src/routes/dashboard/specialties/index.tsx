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
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Skill } from "@/lib/types/skill";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import CreateUpdateSkill from "./-create-update";
import DeleteSkill from "./-delete";

export const Route = createFileRoute("/dashboard/specialties/")({
	component: RouteComponent,
	async loader({ context }) {
		return {
			specialties: await context.orpc.specialties.getAll.call(),
		};
	},
});

function RouteComponent() {
	const { specialties: initialData } = Route.useLoaderData();
	const { orpc } = Route.useRouteContext();
	const [search, setSearch] = useState("");

	const { data: specialties } = useQuery(
		orpc.specialties.getAll.queryOptions({
			initialData,
		}),
	);

	return (
		<Dashboard>
			<DashboardHeader>
				<DashboardTitle hideNavigation>
					<DashboardTitleText>Специальности</DashboardTitleText>
				</DashboardTitle>
				<div className="flex items-center gap-2">
					<Search search={search} setSearch={setSearch} />
					<CreateUpdateSkill />
				</div>
			</DashboardHeader>
			<DashboardContent>
				<DataTable
					columns={columns}
					data={specialties.filter((u) => {
						if (!search) return true;
						return [u.name]
							.map((s) => s.toLowerCase())
							.includes(search.toLowerCase());
					})}
				/>
			</DashboardContent>
		</Dashboard>
	);
}

export const columns: ColumnDef<Skill>[] = [
	{
		accessorKey: "name",
		header: "Название",
	},
	{
		id: "actions",
		cell: ({ row: { original: specialty } }) => {
			return (
				<div className="flex items-center justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<EllipsisVertical />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<CreateUpdateSkill specialty={specialty} />
							<DeleteSkill specialty={specialty} />
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
