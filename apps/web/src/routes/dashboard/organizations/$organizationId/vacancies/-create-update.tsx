import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Vacancy } from "@/lib/types/vacancy";
import { cn } from "@/lib/utils";
import { orpc, queryClient } from "@/utils/orpc";
import { VacancySchema } from "@lunarweb/shared/schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronDownIcon, MoveRightIcon, SquarePenIcon } from "lucide-react";
import React from "react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod/v4";
import {
	workFormatNames,
	workFormatTypes,
	type WorkFormat,
} from "@lunarweb/shared/types";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import MultpleSelect from "@/components/ui/multiple-select";
import { Route } from ".";

const tabs = ["Данные", "Условия", "Навыки", "Обязанности"] as const;

export default function CreateUpdateVacancy({
	vacancy,
}: {
	vacancy?: Vacancy;
}) {
	const search = Route.useSearch();

	const { data: skills } = useQuery(orpc.skills.getAll.queryOptions());
	const { data: specialties } = useQuery(
		orpc.specialties.getAll.queryOptions(),
	);

	const [tabIndex, setTabIndex] = useState(0);
	const [open, setOpen] = useState(false);

	const createVacancyMutation = useMutation(
		orpc.vacancies.create.mutationOptions({
			onSuccess: async () => {
				setOpen(false);
				toast.success("Вакансия создана");
				await queryClient.invalidateQueries({
					queryKey: orpc.vacancies.getAll.queryKey(),
				});
			},
		}),
	);

	const updateVacancyMutation = useMutation(
		orpc.vacancies.update.mutationOptions({
			onSuccess: async () => {
				setOpen(false);
				toast.success("Вакансия обновлена");
				await queryClient.invalidateQueries({
					queryKey: orpc.vacancies.getAll.queryKey(),
				});
				form.reset();
			},
		}),
	);

	const form = useForm({
		defaultValues: {
			...vacancy,
			type: search.type,
			skillIds: vacancy?.skillIds ?? [],
		} as z.infer<typeof VacancySchema>,
		onSubmit: async ({ value }) => {
			console.log("onSubmit", value);
			if (vacancy) {
				updateVacancyMutation.mutate({
					...value,
					id: vacancy.id,
				});
			} else {
				createVacancyMutation.mutate(value);
			}
		},
		validators: {
			onSubmit: VacancySchema,
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{vacancy ? (
					<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
						<SquarePenIcon />
						<span>Редактировать</span>
					</DropdownMenuItem>
				) : (
					<Button>Создать</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{vacancy ? "Редактировать" : "Создать"} вакансию
					</DialogTitle>
				</DialogHeader>
				<div className="flex gap-2 items-center justify-between">
					{tabs.map((tab, index) => {
						const isActive = index > tabIndex;

						return (
							<React.Fragment key={tab + "tab"}>
								<div
									className={cn(
										"flex items-center gap-2 text-xs",
										isActive ? "text-zinc-900" : "text-zinc-500",
									)}
								>
									<span
										className={cn(
											"size-6 rounded-full flex items-center justify-center font-medium",
											isActive
												? "bg-zinc-100 text-zinc-500"
												: "bg-primary text-white",
										)}
									>
										{index + 1}
									</span>
									{tab}
								</div>
								<MoveRightIcon className="text-zinc-200 last:hidden" />
							</React.Fragment>
						);
					})}
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						void form.handleSubmit();
					}}
					className="space-y-4 grid grid-cols-1 grid-rows-1"
				>
					<div
						className={cn(
							"row-start-1 col-start-1 space-y-4",
							tabIndex === 0 ? "opacity-100" : "opacity-0 pointer-events-none",
						)}
					>
						<form.Field name="name">
							{(field) => (
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Название"
									errors={field.state.meta.errors.map(
										(error) => error?.message,
									)}
								/>
							)}
						</form.Field>
						<form.Field name="workFormat">
							{(field) => {
								const hasErrors = field.state.meta.errors?.length > 0;

								return (
									<div className="w-full">
										<Label>Формат работы</Label>
										<Select
											value={field.state.value}
											onValueChange={(v) => field.handleChange(v as WorkFormat)}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Выберите формат" />
											</SelectTrigger>
											<SelectContent>
												{workFormatTypes.map((f) => (
													<SelectItem key={f} value={f}>
														{workFormatNames[f]}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<div
											className={cn(
												"flex flex-col gap-1 transition-all duration-300",
												hasErrors
													? "opacity-100 translate-y-0 blur-none mt-2"
													: "opacity-0 -translate-y-6 blur-sm",
											)}
										>
											{field.state.meta.errors?.filter(Boolean).map((error) => (
												<p className="text-destructive text-sm" key={error}>
													{error?.message}
												</p>
											))}
										</div>
									</div>
								);
							}}
						</form.Field>
						<form.Field name="address">
							{(field) => (
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Адрес"
									errors={field.state.meta.errors.map(
										(error) => error?.message,
									)}
								/>
							)}
						</form.Field>
					</div>
					<div
						className={cn(
							"row-start-1 col-start-1 space-y-4",
							tabIndex === 1 ? "opacity-100" : "opacity-0 pointer-events-none",
						)}
					>
						<div className="grid grid-cols-2 gap-4">
							<form.Field name="salaryFrom">
								{(field) => (
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										postfix="₽"
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="От"
										errors={field.state.meta.errors.map(
											(error) => error?.message,
										)}
									/>
								)}
							</form.Field>
							<form.Field name="salaryTo">
								{(field) => (
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										postfix="₽"
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="До"
										errors={field.state.meta.errors.map(
											(error) => error?.message,
										)}
									/>
								)}
							</form.Field>
						</div>
						<form.Field name="expiresAt">
							{(field) => (
								<DatePicker
									value={field.state.value}
									onChange={(val) => {
										if (val) {
											field.handleChange(val);
										}
									}}
									placeholder="Дата окончания публикации"
								/>
							)}
						</form.Field>
						<form.Field name="conditions">
							{(field) => (
								<Input
									id={field.name}
									name={field.name}
									size="textarea"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Условия"
									errors={field.state.meta.errors.map(
										(error) => error?.message,
									)}
								/>
							)}
						</form.Field>
					</div>
					<div
						className={cn(
							"row-start-1 col-start-1 space-y-4",
							tabIndex === 2 ? "opacity-100" : "opacity-0 pointer-events-none",
						)}
					>
						<form.Field name="specialtyId">
							{(field) => {
								const hasErrors = field.state.meta.errors?.length > 0;
								return (
									<div>
										<Label>Специальность</Label>
										<Select
											value={field.state.value}
											onValueChange={(v) => field.handleChange(v)}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Выберите специальность" />
											</SelectTrigger>
											<SelectContent>
												{specialties?.map((s) => (
													<SelectItem key={s.id} value={s.id}>
														{s.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<div
											className={cn(
												"flex flex-col gap-1 transition-all duration-300",
												hasErrors
													? "opacity-100 translate-y-0 blur-none mt-2"
													: "opacity-0 -translate-y-6 blur-sm",
											)}
										>
											{field.state.meta.errors?.filter(Boolean).map((error) => (
												<p className="text-destructive text-sm" key={error}>
													{error?.message}
												</p>
											))}
										</div>
									</div>
								);
							}}
						</form.Field>
						<form.Field name="skillIds">
							{(field) => {
								const hasErrors = field.state.meta.errors?.length > 0;

								return (
									<div>
										<Label>Навыки</Label>
										<MultpleSelect
											value={
												skills?.filter((s) =>
													field.state.value.includes(s.id),
												) ?? []
											}
											values={skills ?? []}
											onChange={(v) => field.handleChange(v.map((v) => v.id))}
											placeholder={{
												default: "Выберите навыки",
												empty: "Нет навыков",
											}}
										>
											<Button
												className="w-full justify-between"
												variant={"secondary"}
											>
												<span>{field.state.value.length} навыков</span>
												<ChevronDownIcon />
											</Button>
										</MultpleSelect>
										<div
											className={cn(
												"flex flex-col gap-1 transition-all duration-300",
												hasErrors
													? "opacity-100 translate-y-0 blur-none mt-2"
													: "opacity-0 -translate-y-6 blur-sm",
											)}
										>
											{field.state.meta.errors?.filter(Boolean).map((error) => (
												<p className="text-destructive text-sm" key={error}>
													{error.message}
												</p>
											))}
										</div>
									</div>
								);
							}}
						</form.Field>

						<form.Field name="requirements">
							{(field) => (
								<Input
									id={field.name}
									name={field.name}
									size="textarea"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Требования"
									errors={field.state.meta.errors.map(
										(error) => error?.message,
									)}
								/>
							)}
						</form.Field>
					</div>
					<div
						className={cn(
							"row-start-1 col-start-1 space-y-4",
							tabIndex === 3 ? "opacity-100" : "opacity-0 pointer-events-none",
						)}
					>
						<form.Field name="responsibilities">
							{(field) => (
								<Input
									id={field.name}
									name={field.name}
									size="textarea"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Обязанности"
									errors={field.state.meta.errors.map(
										(error) => error?.message,
									)}
								/>
							)}
						</form.Field>
					</div>

					<DialogFooter className="flex justify-end items-end">
						{tabIndex === 0 ? (
							<DialogClose asChild>
								<Button type="button" variant="secondary">
									Отмена
								</Button>
							</DialogClose>
						) : (
							<Button
								type="button"
								variant="secondary"
								onClick={() => {
									setTabIndex(tabIndex - 1);
								}}
							>
								Назад
							</Button>
						)}
						{tabIndex !== tabs.length - 1 ? (
							<Button type="button" onClick={() => setTabIndex(tabIndex + 1)}>
								{tabIndex < tabs.length - 1 ? "Далее" : "Сохранить"}
							</Button>
						) : (
							<form.Subscribe>
								{(state) => (
									<Button
										type="submit"
										loading={
											state.isSubmitting ||
											updateVacancyMutation.isPending ||
											createVacancyMutation.isPending
										}
										disabled={!state.canSubmit}
									>
										Сохранить
									</Button>
								)}
							</form.Subscribe>
						)}
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
