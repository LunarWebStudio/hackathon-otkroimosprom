import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { Header } from "./-header";
import JobPhoto from "../../../public/job.png";
import InternshipPhoto from "../../../public/internship.png";
import { Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo } from "react";

export const Route = createFileRoute("/_landing/")({
	component: RouteComponent,
	async loader({ context }) {
		return {
			user: context.session?.user,
			vacancies: await context.orpc.vacancies.getByCompatabilityRating.call(),
			orgations: await context.orpc.organizations.getForFilter.call(),
			specialties: await context.orpc.specialties.getAll.call(),
		};
	},
	validateSearch: (search: Record<string, unknown>) => {
		return {
			type: search.type === "internship" ? "internship" : "job",
			organisation: search.organisation,
			specialty: search.specialty,
		};
	},
});

function RouteComponent() {
	const search = useSearch({ from: "/_landing/" });
	const navigate = useNavigate({ from: "/" });

	return (
		<div className=" relative w-screen">
			<div className=" container flex flex-col gap-16">
				<StartBlock
					type={search.type}
					setType={(newType) =>
						navigate({
							search: (prev) => ({ ...prev, type: newType }),
						})
					}
				/>
				<Vacancies type={search.type} />
			</div>
			<div className="absolute top-0 right-0 w-1/3">
				{search.type === "job" ? (
					<img
						src={JobPhoto}
						alt="Job"
						className=" object-cover w-full h-full"
						width={1920}
						height={1080}
					/>
				) : (
					<img
						src={InternshipPhoto}
						alt="Job"
						className=" object-cover w-full h-full"
						width={1920}
						height={1080}
					/>
				)}
			</div>
		</div>
	);
}

const jobFacilities = [
	"Карьерный рост",
	"Инновационные проекты",
	"Партнёрство с лидерами",
	"Профессиональное развитие",
	"Работа в кластере",
];
const internshipFacilities = [
	"Начни карьеру в инновациях",
	"Первый шаг в технологию",
	"Стажировки в компаниях будущего",
];

function StartBlock({
	type,
	setType,
}: {
	type: "job" | "internship";
	setType: (t: "job" | "internship") => void;
}) {
	return (
		<div className="flex flex-row items-center justify-start pt-8">
			<svg
				width="64"
				height="500"
				viewBox="0 0 64 500"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M42.8685 497.348L12.1056 466.099C1.47838 454.481 2.73686 445.266 2.66694 443.744L2.66694 105.534M2.66694 107.216L2.66694 56.2567C2.80678 54.6542 1.47838 45.5198 12.1056 33.9016L42.8685 2.6527"
					stroke="#D00E46"
					strokeMiterlimit="10"
					strokeLinecap="round"
				/>
			</svg>
			<div className="flex flex-col h-full justify-center py-16 gap-12">
				<div className="flex flex-col gap-4">
					<div className="text-4xl font-medium">
						<h1 className="text-maintext">
							Начни {type === "job" ? "карьеру" : "стажировку"}
						</h1>
						<h1 className="text-primary">в ОЭЗ «Технополис Москва»</h1>
					</div>
					<div className="flex flex-col gap-2">
						{type === "job"
							? jobFacilities.map((item) => (
									<div key={item} className="flex flex-row gap-2 items-center">
										<span className="text-primary">•</span>
										<span className="text-maintext font-normal text-base">
											{item}
										</span>
									</div>
								))
							: internshipFacilities.map((item) => (
									<div key={item} className="flex flex-row gap-2 items-center">
										<span className="text-primary">•</span>
										<span className="text-maintext">{item}</span>
									</div>
								))}
					</div>
				</div>
				<div className="flex flex-row gap-6 items-center">
					<Button
						onClick={() => setType(type === "job" ? "internship" : "job")}
					>
						{type === "job" ? "Смотреть стажировки" : "Выбрать вакансии"}
					</Button>
					<Button
						className=""
						variant={"dark"}
						onClick={() => (window.location.href = "/dashboard")}
					>
						Войти в кабинет
					</Button>
				</div>
			</div>
		</div>
	);
}

export function formatSalary(value: number): string {
	if (isNaN(value)) return "0 ₽";
	return `${value.toLocaleString("ru-RU")} ₽`;
}

export function Vacancies({ type }: { type: "job" | "internship" }) {
	const search = useSearch({ from: "/_landing/" });
	const navigate = useNavigate({ from: "/" });

	const { vacancies, orgations, specialties } = Route.useLoaderData();

	// выбранные id из searchParams
	const selectedOrganizations = search.orgIds ? search.orgIds.split(",") : [];
	const selectedSpecialties = search.specIds ? search.specIds.split(",") : [];

	// функция для обновления параметров
	const updateParams = (key: string, id: string) => {
		const current = (search[key] ? search[key].split(",") : []) as string[];
		let next: string[];

		if (current.includes(id)) {
			next = current.filter((x) => x !== id);
		} else {
			next = [...current, id];
		}

		navigate({
			search: (prev) => ({
				...prev,
				[key]: next.length > 0 ? next.join(",") : undefined,
			}),
		});
	};

	const sortedVacancies = useMemo(() => {
		return vacancies.filter((v) => {
			const orgMatch =
				selectedOrganizations.length === 0 ||
				selectedOrganizations.includes(v.organization.id);

			const specMatch =
				selectedSpecialties.length === 0 ||
				selectedSpecialties.includes(v.specialty.id);

			const typeMatch = !type || v.type.toUpperCase() === type.toUpperCase();

			return orgMatch && specMatch && typeMatch;
		});
	}, [vacancies, selectedOrganizations, selectedSpecialties, type]);

	return (
		<div>
			<div className="flex flex-col gap-6 text-maintext">
				<div className="flex flex-row items-start">
					<h1 className="text-4xl font-medium">
						{type === "job" ? "Вакансии" : "Стажировки"}
					</h1>
					<p className="font-medium">({sortedVacancies.length})</p>
				</div>
				<div className="flex flex-row gap-6 items-start">
					<div className="w-full flex flex-col gap-6">
						{sortedVacancies.map((vacancy) => (
							<div
								key={vacancy.id}
								className="w-full rounded-lg p-4 bg-vacancy-card"
							>
								<div className="text-primary border border-primary rounded-xl text-sm w-fit px-2 py-0.5">
									{vacancy.organization.name}
								</div>
								<div className="text-base font-normal">
									<h1 className="text-2xl font-medium">{vacancy.name}</h1>
									{type === "job" && (
										<>
											{!!vacancy.salaryFrom || !!vacancy.salaryTo ? (
												<div className="flex flex-row gap-2">
													{vacancy.salaryFrom && (
														<p>от {formatSalary(vacancy.salaryFrom)}</p>
													)}
													{vacancy.salaryTo && (
														<p>до {formatSalary(vacancy.salaryTo)}</p>
													)}
													<p>за месяц</p>
												</div>
											) : (
												<p>по договоренности</p>
											)}
										</>
									)}
								</div>
								<div className="flex flex-row gap-2 items-center mt-1 font-medium">
									<span className="text-primary">•</span>
									<span className="text-maintext">
										{vacancy.specialty.name}
									</span>
								</div>
								<Button
									className="mt-6"
									onClick={() =>
										(window.location.href = `/vacancy/${vacancy.id}`)
									}
								>
									Откликнуться
								</Button>
							</div>
						))}
					</div>

					<div className="w-1/4 bg-vacancy-card rounded-lg p-4 flex flex-col gap-6">
						<h1 className="text-xl font-medium">Фильтры</h1>

						<div className="flex flex-col gap-4">
							<h1 className="font-medium">Предприятия</h1>
							<div className="flex flex-col gap-2">
								<div className="flex flex-row gap-2 items-center text-base font-normal">
									<Checkbox
										checked={selectedOrganizations.length === 0}
										onCheckedChange={() =>
											navigate({ search: (p) => ({ ...p, orgIds: undefined }) })
										}
									/>
									<p>Все предприятия</p>
								</div>
								{orgations.map((item) => (
									<div
										key={item.id}
										className="flex flex-row gap-2 items-center text-base font-normal"
									>
										<Checkbox
											checked={selectedOrganizations.includes(item.id)}
											onCheckedChange={() => updateParams("orgIds", item.id)}
										/>
										<p>{item.name}</p>
									</div>
								))}
							</div>
						</div>

						<div className="flex flex-col gap-4">
							<h1 className="font-medium">Направления</h1>
							<div className="flex flex-col gap-2">
								<div className="flex flex-row gap-2 items-center text-base font-normal">
									<Checkbox
										checked={selectedSpecialties.length === 0}
										onCheckedChange={() =>
											navigate({
												search: (p) => ({ ...p, specIds: undefined }),
											})
										}
									/>
									<p>Все направления</p>
								</div>
								{specialties.map((item) => (
									<div
										key={item.id}
										className="flex flex-row gap-2 items-center text-base font-normal"
									>
										<Checkbox
											checked={selectedSpecialties.includes(item.id)}
											onCheckedChange={() => updateParams("specIds", item.id)}
										/>
										<p>{item.name}</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
