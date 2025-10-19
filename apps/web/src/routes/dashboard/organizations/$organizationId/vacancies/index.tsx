import Search from "@/components/search";
import { BreadcrumbDynamic } from "@/components/ui/breadcrumb";
import {
	Dashboard,
	DashboardContent,
	DashboardHeader,
	DashboardTitle,
	DashboardTitleText,
} from "@/components/ui/dashboard";
import { workFormatNames } from "@lunarweb/shared/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import CreateUpdateVacancy from "./-create-update";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Vacancy } from "@/lib/types/vacancy";
import VacancyStatusBadge from "@/components/vacancy-status-badge";
import { format } from "date-fns";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, SquareArrowUpLeftIcon } from "lucide-react";
import { VacancyTypeSchema } from "@lunarweb/shared/schemas";
import z from "zod/v4";

export const Route = createFileRoute(
	"/dashboard/organizations/$organizationId/vacancies/",
)({
	validateSearch: z
		.object({
			vacancyType: z.string().nullish(),
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
			input: searchParams.type,
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
					<CreateUpdateVacancy />
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
		accessorKey: "applications.length",
		header: "Отклики",
	},
	{
		id: "status",
		header: "Статус",
		cell: ({ row: { original: vacancy } }) => (
			<VacancyStatusBadge
				vacancyStatus={
					vacancy.expiresAt.getTime() < Date.now() ? "ARCHIVED" : vacancy.status
				}
			/>
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
			const params = Route.useParams();
			return (
				<div className="flex items-center justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<EllipsisVertical />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>
								<Link
									to={
										"/dashboard/organizations/$organizationId/vacancies/$vacancyId"
									}
									params={{
										...params,
										vacancyId: vacancy.id,
									}}
									className="flex items-center gap-2"
								>
									<SquareArrowUpLeftIcon />
									Отклики
								</Link>
							</DropdownMenuItem>
							<CreateUpdateVacancy vacancy={vacancy} />
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
