import { createFileRoute, notFound } from "@tanstack/react-router";
import {
	Dashboard,
	DashboardContent,
	DashboardHeader,
	DashboardTitle,
} from "@/components/ui/dashboard";
import CompatabilityBadge from "../-compatability-rating";
import ApplyButton from "../-apply-button";
import { currencyFormatter } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/users/vacancies/$vacancyId/")({
	component: RouteComponent,
	async loader({ context, params }) {
		const vacancies =
			await context.orpc.vacancies.getByCompatabilityRating.call();
		const vacancy = vacancies.find((v) => v.id === params.vacancyId);
		if (!vacancy) {
			throw notFound();
		}
		return {
			vacancy,
		};
	},
});

function RouteComponent() {
	const { vacancy } = Route.useLoaderData();
	const search = Route.useSearch();

	const blocks = [
		{
			title: "Обязанности",
			value: vacancy.responsibilities,
		},
		{
			title: "Требования",
			value: vacancy.requirements,
		},
		{
			title: "Условия",
			value: vacancy.conditions,
		},
	];

	return (
		<Dashboard>
			<DashboardHeader>
				<DashboardTitle hideNavigation>
					{vacancy.type === "JOB" ? "Вакансия" : "Стажировка"}
				</DashboardTitle>
			</DashboardHeader>
			<DashboardContent>
				<div key={vacancy.id} className="flex flex-col gap-6">
					<div className="flex justify-between">
						<div className="flex flex-col gap-2">
							<div className="rounded-full size-fit border border-primary text-primary px-2 py-1">
								{vacancy.organization.name}
							</div>
							<div className="">
								<p className="font-medium text-2xl">{vacancy.name}</p>
								{vacancy.salaryFrom && (
									<p>
										{" "}
										От {currencyFormatter.format(vacancy.salaryFrom)} в месяц
									</p>
								)}
							</div>
							<div className="flex items-center gap-2">
								<div className="bg-primary rounded-full size-2" />
								<p>{vacancy.address}</p>
							</div>
						</div>
						<CompatabilityBadge percentage={vacancy.compatabilityRating} />
					</div>
					<ApplyButton vacancy={vacancy} />
					{blocks.map((block) => (
						<div
							key={block.title}
							className="border rounded-xl p-4 flex flex-col gap-2"
						>
							<p className="font-medium text-2xl">{block.title}</p>
							<p>{block.value}</p>
						</div>
					))}
				</div>
			</DashboardContent>
		</Dashboard>
	);
}
