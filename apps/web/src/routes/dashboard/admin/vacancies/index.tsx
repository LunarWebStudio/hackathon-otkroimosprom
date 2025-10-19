import Search from "@/components/search";
import { BreadcrumbDynamic } from "@/components/ui/breadcrumb";
import {
	Dashboard,
	DashboardContent,
	DashboardHeader,
	DashboardTitle,
	DashboardTitleText,
} from "@/components/ui/dashboard";
import { VacancyTypeSchema } from "@lunarweb/shared/schemas";
import { workFormatNames } from "@lunarweb/shared/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod/v4";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Vacancy } from "@/lib/types/vacancy";
import VacancyStatusBadge from "@/components/vacancy-status-badge";
import { format } from "date-fns";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import UpdateVacancyStatus from "./-update-status";
import UserorganizationStatusBadge from "@/components/organization-status-badge";

export const Route = createFileRoute("/dashboard/admin/vacancies/")({
	validateSearch: z
		.object({
			vacancyType: VacancyTypeSchema.nullish(),
		})
		.nullish()
		.default({
			vacancyType: "JOB",
		}),
	component: RouteComponent,
	loaderDeps: ({ search }) => ({ search }),
	async loader({ deps: { search }, context }) {
		return {
			vacancies: await context.orpc.vacancies.getAll.call(search),
		};
	},
});

function RouteComponent() {
	const { orpc } = Route.useRouteContext();
	const { vacancies: initialData } = Route.useLoaderData();
	const searchParams = Route.useSearch();
	const [search, setSearch] = useState("");

	const { data: vacancies } = useQuery(
		orpc.vacancies.getAll.queryOptions({
			input: searchParams,
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
					data={vacancies.filter((u) => {
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

export const columns: ColumnDef<Vacancy>[] = [
	{
		accessorKey: "serial",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Название",
	},
	{
		accessorKey: "workFormat",
		header: "Формат",
		cell: ({ row: { original: vacancy } }) =>
			workFormatNames[vacancy.workFormat],
	},
	{
		accessorKey: "organization.name",
		header: "Компания",
	},

	{
		id: "status",
		header: "Статус",
		cell: ({ row: { original: vacancy } }) => (
			<UserorganizationStatusBadge organizationStatus={vacancy.status} />
		),
	},
	{
		accessorKey: "createdAt",
		header: "Дата создания",
		cell: ({ cell }) => format(cell.getValue() as Date, "dd.MM.yyyy"),
	},
	{
		id: "actions",
		header: "",
		cell: ({ row: { original: vacancy } }) => {
			return (
				<div className="flex items-center justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<EllipsisVertical />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<UpdateVacancyStatus status="APPROVED" vacancy={vacancy} />
							<UpdateVacancyStatus status="REJECTED" vacancy={vacancy} />
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
