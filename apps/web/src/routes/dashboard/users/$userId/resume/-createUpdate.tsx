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
import { useMutation } from "@tanstack/react-query";
import { orpc, queryClient } from "@/utils/orpc";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import React from "react";
import { Check, MoveRightIcon, Pencil, Upload } from "lucide-react";
import { ResumeSchema } from "@lunarweb/shared/schemas";
import type { Resume } from "@/lib/types/resume";
import { useForm } from "@tanstack/react-form";
import z from "zod/v4";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FileInput } from "@/components/ui/image-input";
import type { Skill } from "@/lib/types/skill";
import type { Specialty } from "@/lib/types/specialty";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { FileSvg } from "./-fileSvg";

const tabs = [
	"Выбор",
	"Фото",
	"Основное",
	"Контакты",
	"Требования",
	"Образование",
	"О себе",
] as const;

const gendersNames = {
	MALE: "Мужской",
	FEMALE: "Женский",
};

export function CreateUpdateResume({
	resume,
	skills,
	specialties,
}: {
	resume?: Resume;
	skills: Skill[];
	specialties: Specialty[];
}) {
	const [tabIndex, setTabIndex] = useState(0);
	const [open, setOpen] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

	const createMutation = useMutation(
		orpc.resume.create.mutationOptions({
			onSuccess: async () => {
				setOpen(false);
				toast.success("Резюме создано");
				await queryClient.invalidateQueries({
					queryKey: orpc.resume.getAll.queryKey(),
				});
			},
		}),
	);

	const updateMutation = useMutation(
		orpc.resume.update.mutationOptions({
			onSuccess: async () => {
				setOpen(false);
				toast.success("Резюме обновлено");
				await queryClient.invalidateQueries({
					queryKey: orpc.resume.getAll.queryKey(),
				});
			},
		}),
	);

	const form = useForm({
		defaultValues: resume as z.infer<typeof ResumeSchema>,
		onSubmit: async ({ value }) => {
			if (resume) {
				updateMutation.mutate({
					...value,
					id: resume.id,
				});
			} else {
				createMutation.mutate({
					...value,
				});
			}
		},
		validators: {
			onSubmit: ResumeSchema,
		},
	});

	useEffect(() => {
		if (tabIndex <= 0) return;

		const activeEl = tabRefs.current[tabIndex - 1];
		const container = containerRef.current;

		if (activeEl && container) {
			const { offsetLeft, offsetWidth } = activeEl;
			const containerWidth = container.offsetWidth;

			if (offsetLeft > containerWidth / 2) {
				container.scrollTo({
					left: offsetLeft - containerWidth / 2 + offsetWidth / 2,
					behavior: "smooth",
				});
			} else {
				container.scrollTo({ left: 0, behavior: "smooth" });
			}
		}
	}, [tabIndex]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="font-normal">Создать резюме</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Создание резюме</DialogTitle>
				</DialogHeader>

				{tabIndex === 0 ? (
					<div className="flex flex-col gap-3 py-4">
						{/* Вариант: Загрузить файл */}
						<button
							type="button"
							className="flex w-full items-start gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left transition hover:border-red-500"
							onClick={() =>
								toast.info("Загрузка файла пока не реализована 🙂")
							}
						>
							<div className="flex h-12 w-12 items-center justify-center rounded-md bg-zinc-100 shrink-0">
								<FileSvg />
							</div>
							<div className="flex flex-col">
								<span className="text-[15px] font-medium text-zinc-900">
									Загрузить файл
								</span>
								<span className="text-[13px] text-zinc-500">
									Прикрепите готовое резюме в формате DOCX.
								</span>
							</div>
						</button>

						{/* Вариант: Создать резюме */}
						<button
							type="button"
							onClick={() => setTabIndex(1)}
							className="flex w-full items-start gap-3 rounded-lg border hover:border-red-500 px-4 py-3 text-left bg-white shadow-sm !items-center "
						>
							<div className="flex h-12 w-12 items-center justify-center rounded-md bg-zinc-100 shrink-0">
								<FileSvg />
							</div>
							<div className="flex flex-col">
								<span className="text-[15px] font-medium text-zinc-900">
									Создать резюме
								</span>
								<span className="text-[13px] text-zinc-500">
									Заполните форму и получите структурированное резюме, готовое к
									откликам.
								</span>
							</div>
						</button>
					</div>
				) : (
					<>
						<div
							ref={containerRef}
							className="flex gap-2 items-center justify-between overflow-x-auto scroll-smooth no-scrollbar"
						>
							{tabs.slice(1).map((tab, idx) => {
								const stepIndex = idx;
								const displayNumber = idx + 1;
								const currentStep = tabIndex - 1;
								const isCurrent = stepIndex === currentStep;
								const isCompleted = stepIndex < currentStep;

								return (
									<React.Fragment key={tab + "tab"}>
										<div
											ref={(el) => {
												tabRefs.current[stepIndex] = el;
											}}
											className={cn(
												"flex items-center gap-2 text-xs flex-shrink-0 transition-colors",
												isCurrent
													? "text-primary"
													: isCompleted
														? "text-zinc-900"
														: "text-zinc-500",
											)}
										>
											<span
												className={cn(
													"size-6 rounded-full flex items-center justify-center font-medium whitespace-nowrap",
													isCurrent
														? "bg-primary text-white"
														: isCompleted
															? "bg-zinc-100 text-zinc-800"
															: "bg-zinc-100 text-zinc-500",
												)}
											>
												{displayNumber}
											</span>
											{tab}
										</div>
										<MoveRightIcon className="text-zinc-200 last:hidden flex-shrink-0" />
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
							className="space-y-4"
						>
							{tabIndex === 1 && (
								<form.Field name="photoId">
									{(field) => (
										<FileInput
											setIsLoading={setIsLoading}
											//@ts-ignore
											setFileIds={(ids) =>
												form.setFieldValue("photoId", ids[0])
											}
											fileIds={field.state.value ? [field.state.value] : []}
										/>
									)}
								</form.Field>
							)}
							{tabIndex === 2 && (
								<>
									<form.Field name="title">
										{(field) => (
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Название*"
												errors={field.state.meta.errors.map(
													(error) => error?.message,
												)}
											/>
										)}
									</form.Field>
									<form.Field name="specialtyId">
										{(field) => (
											<>
												<Label>Специальность*</Label>
												<Select
													value={field.state.value}
													onValueChange={field.handleChange}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Выберите специальность" />
													</SelectTrigger>
													<SelectContent>
														{specialties.map((specialty) => (
															<SelectItem
																key={specialty.id}
																value={specialty.id}
															>
																{specialty.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</>
										)}
									</form.Field>
									<form.Field name="name">
										{(field) => (
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="ФИО*"
												errors={field.state.meta.errors.map(
													(error) => error?.message,
												)}
											/>
										)}
									</form.Field>
									<form.Field name="gender">
										{(field) => (
											<>
												<Label>Пол*</Label>
												<Select
													value={field.state.value}
													onValueChange={(value) => field.handleChange(value)}
													placeholder="Пол"
													errors={field.state.meta.errors.map(
														(error) => error?.message,
													)}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Выберите пол" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="MALE">Мужской</SelectItem>
														<SelectItem value="FEMALE">Женский</SelectItem>
													</SelectContent>
												</Select>
											</>
										)}
									</form.Field>
									<form.Field name="birthDate">
										{(field) => (
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												type="date"
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Дата рождения*"
												errors={field.state.meta.errors.map(
													(error) => error?.message,
												)}
											/>
										)}
									</form.Field>
									<form.Field name="citizenship">
										{(field) => (
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Гражданство*"
												errors={field.state.meta.errors.map(
													(error) => error?.message,
												)}
											/>
										)}
									</form.Field>
								</>
							)}

							{tabIndex === 3 && (
								<>
									<form.Field name="phoneNumber">
										{(field) => (
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Телефон"
												errors={field.state.meta.errors.map(
													(error) => error?.message,
												)}
											/>
										)}
									</form.Field>
									<form.Field name="email">
										{(field) => (
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Почта*"
												errors={field.state.meta.errors.map(
													(error) => error?.message,
												)}
											/>
										)}
									</form.Field>
								</>
							)}

							{tabIndex === 4 && (
								<form.Field name="skillIds">
									{(field) => (
										<>
											<Label>Навыки*</Label>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														className="w-full justify-between font-normal"
													>
														{field.state.value?.length
															? skills
																	.filter((s) =>
																		field.state.value.includes(s.id),
																	)
																	.map((s) => s.name)
																	.join(", ")
															: "Выберите навыки"}
													</Button>
												</PopoverTrigger>

												<PopoverContent className="w-[480px] p-2">
													<div className="flex flex-col gap-1 max-h-60 overflow-auto">
														{skills.map((skill) => {
															const selected = field.state.value?.includes(
																skill.id,
															);
															return (
																<button
																	key={skill.id}
																	type="button"
																	className={`flex items-center justify-between rounded px-2 py-2 transition-colors ${
																		selected
																			? "bg-zinc-200 text-black"
																			: "hover:bg-white/10 text-black"
																	}`}
																	onClick={() => {
																		let newValues = [
																			...(field.state.value || []),
																		];
																		if (selected) {
																			newValues = newValues.filter(
																				(id) => id !== skill.id,
																			);
																		} else {
																			newValues.push(skill.id);
																		}
																		field.handleChange(newValues);
																	}}
																>
																	<span>{skill.name}</span>
																	{selected && (
																		<Check className="h-4 w-4 text-black" />
																	)}
																</button>
															);
														})}
													</div>
												</PopoverContent>
											</Popover>
										</>
									)}
								</form.Field>
							)}

							{tabIndex === 5 && (
								<>
									<form.Field name="educationLevel">
										{(field) => (
											<Select
												value={field.state.value}
												onValueChange={(value) => field.handleChange(value)}
												placeholder="Выберите уровень образования"
												errors={field.state.meta.errors.map(
													(error) => error?.message,
												)}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Выберите уровень образования" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="PRIMARY">Начальное</SelectItem>
													<SelectItem value="BASIC">Основное общее</SelectItem>
													<SelectItem value="SECONDARY">
														Среднее общее
													</SelectItem>
													<SelectItem value="VOCATIONAL_SECONDARY">
														Среднее специальное
													</SelectItem>
													<SelectItem value="HIGHER">Высшее</SelectItem>
												</SelectContent>
											</Select>
										)}
									</form.Field>
									<form.Field name="university">
										{(field) => (
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Университет*"
												errors={field.state.meta.errors.map(
													(error) => error?.message,
												)}
											/>
										)}
									</form.Field>
								</>
							)}
							{tabIndex === 6 && (
								<form.Field name="experience">
									{(field) => (
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="О себе"
											size="textarea"
											errors={field.state.meta.errors.map(
												(error) => error?.message,
											)}
										/>
									)}
								</form.Field>
							)}

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
								<form.Subscribe>
									{(state) => (
										<Button
											type={tabIndex === tabs.length - 1 ? "submit" : "button"}
											onClick={() => {
												if (tabIndex !== tabs.length - 1) {
													setTabIndex(tabIndex + 1);
												}
											}}
											loading={
												state.isSubmitting ||
												updateMutation.isPending ||
												createMutation.isPending
											}
											disabled={!state.canSubmit && tabIndex === tabs.length}
										>
											{tabIndex === tabs.length - 1 ? "Сохранить" : "Далее"}
										</Button>
									)}
								</form.Subscribe>
							</DialogFooter>
						</form>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
