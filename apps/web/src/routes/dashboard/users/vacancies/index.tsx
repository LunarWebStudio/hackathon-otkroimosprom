import { BreadcrumbDynamic } from "@/components/ui/breadcrumb";
import {
	Dashboard,
	DashboardContent,
	DashboardHeader,
	DashboardTitle,
} from "@/components/ui/dashboard";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import z from "zod/v4";
import CompatabilityBadge from "./-compatability-rating";
import { currencyFormatter } from "@/lib/utils";
import ApplyButton from "./-apply-button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/dashboard/users/vacancies/")({
	validateSearch: z
		.object({
			companyId: z.string().nullish(),
			specialtyId: z.string().nullish(),
			type: z.string().nullish().default("JOB"),
		})
		.default({ type: "JOB" }),
	component: RouteComponent,
	async loader({ context }) {
		return {
			vacancies: await context.orpc.vacancies.getByCompatabilityRating.call(),
		};
	},
});

function RouteComponent() {
	const search = Route.useSearch();
	const { vacancies } = Route.useLoaderData();

	function getUniqueCompaniesAndSpecialties() {
		const companies = new Map<
			string,
			{
				id: string;
				name: string;
			}
		>();
		const specialties = new Map<
			string,
			{
				id: string;
				name: string;
			}
		>();

		for (const vacancy of vacancies) {
			if (!companies.has(vacancy.organization.id)) {
				companies.set(vacancy.organization.id, {
					id: vacancy.organization.id,
					name: vacancy.organization.name,
				});
			}

			if (!specialties.has(vacancy.specialty.id)) {
				specialties.set(vacancy.specialty.id, {
					id: vacancy.specialty.id,
					name: vacancy.specialty.name,
				});
			}
		}

		return {
			companies: Array.from(companies.values()),
			specialties: Array.from(specialties.values()),
		};
	}

	const { companies, specialties } = getUniqueCompaniesAndSpecialties();
	const navigate = Route.useNavigate();

	return (
		<Dashboard>
			<DashboardHeader>
				<DashboardTitle hideNavigation>
					{search.type === "JOB" ? "Вакансии" : "Стажировки"}
				</DashboardTitle>
				<div className="flex gap-2 items-center">
					<Select
						value={search.companyId ?? undefined}
						onValueChange={(v) =>
							navigate({
								to: ".",
								search: {
									...search,
									companyId: v === search.companyId ? undefined : v,
								},
							})
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Компания" />
						</SelectTrigger>
						<SelectContent>
							{companies.map((company) => (
								<SelectItem key={company.id} value={company.id}>
									{company.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={search.specialtyId ?? undefined}
						onValueChange={(v) =>
							navigate({
								to: ".",
								search: {
									...search,
									specialtyId: v,
								},
							})
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Cпециальность" />
						</SelectTrigger>
						<SelectContent>
							{specialties.map((specialty) => (
								<SelectItem key={specialty.id} value={specialty.id}>
									{specialty.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</DashboardHeader>
			<DashboardContent>
				{vacancies
					.filter((v) => {
						if (search.companyId && search.companyId !== v.organization.id) {
							return false;
						}

						if (search.specialtyId && search.specialtyId !== v.specialty.id) {
							return false;
						}

						return true;
					})
					.map((v) => (
						<div
							key={v.id}
							className="border rounded-xl p-4 flex flex-col gap-6"
						>
							<div className="flex justify-between">
								<Link
									to="/dashboard/users/vacancies/$vacancyId"
									params={{ vacancyId: v.id }}
									className="flex flex-col gap-2"
								>
									<div className="rounded-full size-fit border border-primary text-primary px-2 py-1">
										{v.organization.name}
									</div>
									<div className="">
										<p className="font-medium text-2xl">{v.name}</p>
										{v.salaryFrom && (
											<p>
												{" "}
												От {currencyFormatter.format(v.salaryFrom)} в месяц
											</p>
										)}
									</div>
									<div className="flex items-center gap-2">
										<div className="bg-primary rounded-full size-2" />
										<p>{v.address}</p>
									</div>
								</Link>
								<CompatabilityBadge percentage={v.compatabilityRating} />
							</div>
							<ApplyButton vacancy={v} />
						</div>
					))}
			</DashboardContent>
		</Dashboard>
	);
}
