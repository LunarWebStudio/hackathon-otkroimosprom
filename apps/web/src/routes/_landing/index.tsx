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

export const Route = createFileRoute("/_landing/")({
	component: RouteComponent,
	async loader({ context }) {
		return {
			// vacancies: await context.orpc.vacancies.getAll.call(),
			user: context.session?.user,
		};
	},
	validateSearch: (search: Record<string, unknown>) => {
		return {
			type: search.type === "internship" ? "internship" : "job",
		};
	},
});

function RouteComponent() {
	const search = useSearch({ from: "/_landing/" });
	const navigate = useNavigate({ from: "/" });

	return (
		<div className=" relative w-screen">
			<div className=" container">
				<StartBlock
					type={search.type}
					setType={(newType) =>
						navigate({
							search: (prev) => ({ ...prev, type: newType }),
						})
					}
				/>
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
						<h1 className="text-maintext">Начни карьеру</h1>
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
