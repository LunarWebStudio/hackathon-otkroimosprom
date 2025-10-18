import { Button } from "@/components/ui/button";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { formatSalary } from "../..";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { toast } from "sonner";

export const Route = createFileRoute("/_landing/vacancies/$vacancyId/")({
	component: RouteComponent,
	async loader({ context, params }) {
		const foundedVacancy = await context.orpc.vacancies.getOne.call({
			id: params.vacancyId,
		});
		return {
			vacancy: foundedVacancy!,
			user: context.session?.user,
		};
	},
});

function RouteComponent() {
	const { vacancy, user } = Route.useLoaderData();

	return (
		<div className=" container mt-20 flex flex-col gap-6 justify-start items-start">
			<Button
				variant={"transparent"}
				className="flex flex-row gap-1.5 items-center text-base font-normal"
				onClick={() => (window.location.href = "/")}
			>
				<ChevronLeft strokeWidth={1} /> <p>Назад</p>
			</Button>
			<div className="flex flex-col gap-12 w-full">
				<div className="flex flex-col gap-4">
					<div className="text-primary border border-primary rounded-xl text-sm w-fit px-2 py-0.5">
						{vacancy.organization.name}
					</div>
					<div className="text-base font-normal flex flex-col gap-2">
						<h1 className="text-4xl font-medium">{vacancy.name}</h1>
						{vacancy.type === "JOB" && (
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
						<CreateRequest vacancyId={vacancy.id} authirized={!!user} />
					</div>
				</div>
				<div className="flex flex-col gap-4 w-1/2">
					<div className="flex flex-col bg-vacancy-card p-4 rounded-lg">
						<h1 className="text-xl font-medium">Обязанности</h1>
						<div className="flex flex-row gap-2 items-center mt-1 font-normal items-start">
							<span className="text-primary text-xl">•</span>
							<span className="text-maintext">{vacancy.responsibilities}</span>
						</div>
					</div>
					{vacancy.type === "JOB" && (
						<>
							<div className="flex flex-col bg-vacancy-card p-4 rounded-lg ">
								<h1 className="text-xl font-medium">Требования</h1>
								<div className="flex flex-row gap-2 items-center mt-1 font-normal items-start">
									<span className="text-primary text-xl">•</span>
									<span className="text-maintext">{vacancy.requirements}</span>
								</div>
							</div>
							<div className="flex flex-col bg-vacancy-card p-4 rounded-lg">
								<h1 className="text-xl font-medium">Условия</h1>
								<div className="flex flex-row gap-2 items-center mt-1 font-normal items-start">
									<span className="text-primary text-xl">•</span>
									<span className="text-maintext">{vacancy.conditions}</span>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

function CreateRequest({
	vacancyId,
	authirized,
}: {
	vacancyId: string;
	authirized: boolean;
}) {
	const createRequestMutation = useMutation(
		orpc.requests.create.mutationOptions({
			onSuccess: async () => {
				toast.success("Заявка отправлена");
				setTimeout(() => {
					window.location.href = "/";
				}, 1000);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	return (
		<>
			{!authirized ? (
				<Dialog>
					<DialogTrigger asChild>
						<Button className="w-fit text-sm">Откликнуться</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Подайте заявку на регистрацию</DialogTitle>
						</DialogHeader>
						<p className="text-center">
							Чтобы отправить заявку, зарегистрируйтесь на платформе. После
							регистрации вы сможете заполнить форму и дождаться подтверждения
							от администратора.
						</p>
						<DialogFooter className="flex flex-row justify-end gap-4">
							<DialogClose>
								<Button variant={"secondary"} className="text-sm">
									Отмена
								</Button>
							</DialogClose>
							<Button
								className="text-sm"
								onClick={() => (window.location.href = "/auth/sign-up")}
							>
								Зарегистрироваться
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			) : (
				<Button
					className="w-fit text-sm"
					onClick={() => createRequestMutation.mutate({ vacancyId })}
				>
					Откликнуться
				</Button>
			)}
		</>
	);
}
