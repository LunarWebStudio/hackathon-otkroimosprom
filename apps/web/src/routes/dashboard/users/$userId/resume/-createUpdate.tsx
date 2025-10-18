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
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import React from "react";
import { ChevronDownIcon, MoveRightIcon } from "lucide-react";
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
import { FileSvg } from "./-fileSvg";
import MultpleSelect from "@/components/ui/multiple-select";
import { DatePicker } from "@/components/ui/date-picker";
import { useRouteContext } from "@tanstack/react-router";

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
	const { session } = useRouteContext({
		strict: false,
	});

	const [tabIndex, setTabIndex] = useState(0);
	const [open, setOpen] = useState(false);
	const [isFileLoading, setIsFileLoading] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);

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
		defaultValues: {
			name: session?.user.name,
			gender: session?.user.gender,
			imageId: session?.user.image,
			email: session?.user.email,
			phoneNumber: session?.user.phoneNumber,
			...resume,
			skillIds: resume?.skillIds ?? [],
		} as z.infer<typeof ResumeSchema>,
		onSubmit: async ({ value }) => {
			console.log({ valuehere: value });
			if (resume) {
				updateMutation.mutate({
					...value,
					id: resume.id,
				});
			} else {
				createMutation.mutate(value);
			}
		},
		validators: {
			onSubmit: ResumeSchema,
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="font-normal">Создать резюме</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Создание резюме</DialogTitle>
				</DialogHeader>
				<div
					className="flex relative gap-2 items-center justify-between max-w-full overflow-x-scroll text-nowrap"
					ref={containerRef}
				>
					{tabs.map((tab, index) => {
						if (index === 0) return null;

						const isActive = index > tabIndex;

						return (
							<React.Fragment key={tab + "tab"}>
								<div
									id={`tab-indicator-${index}`}
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
										{index}
									</span>
									{tab}
								</div>
								<MoveRightIcon className="shrink-0 text-zinc-200 last:hidden" />
							</React.Fragment>
						);
					})}
				</div>

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
								tabIndex === 1
									? "opacity-100"
									: "opacity-0 pointer-events-none",
							)}
						>
							<form.Field name="photoId">
								{(field) => (
									<FileInput
										setIsLoading={setIsFileLoading}
										setFileIds={(ids) => form.setFieldValue("photoId", ids[0])}
										accept="image/*"
										fileIds={field.state.value ? [field.state.value] : []}
									/>
								)}
							</form.Field>
						</div>
						<div
							className={cn(
								"row-start-1 col-start-1 space-y-4",
								tabIndex === 2
									? "opacity-100"
									: "opacity-0 pointer-events-none",
							)}
						>
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
													<SelectItem key={specialty.id} value={specialty.id}>
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
									<DatePicker
										value={field.state.value}
										onChange={(val) => {
											if (val) {
												field.handleChange(val);
											}
										}}
										placeholder="Дата рождения"
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
						</div>
						<div
							className={cn(
								"row-start-1 col-start-1 space-y-4",
								tabIndex === 3
									? "opacity-100"
									: "opacity-0 pointer-events-none",
							)}
						>
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
						</div>
						<div
							className={cn(
								"row-start-1 col-start-1 space-y-4",
								tabIndex === 4
									? "opacity-100"
									: "opacity-0 pointer-events-none",
							)}
						>
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
												{field.state.meta.errors
													?.filter(Boolean)
													.map((error) => (
														<p className="text-destructive text-sm" key={error}>
															{error.message}
														</p>
													))}
											</div>
										</div>
									);
								}}
							</form.Field>
						</div>

						<div
							className={cn(
								"row-start-1 col-start-1 space-y-4",
								tabIndex === 5
									? "opacity-100"
									: "opacity-0 pointer-events-none",
							)}
						>
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
											<SelectItem value="SECONDARY">Среднее общее</SelectItem>
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
						</div>
						<div
							className={cn(
								"row-start-1 col-start-1 space-y-4",
								tabIndex === 6
									? "opacity-100"
									: "opacity-0 pointer-events-none",
							)}
						>
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
									Далее
								</Button>
							) : (
								<form.Subscribe>
									{(state) => (
										<Button
											type="submit"
											loading={
												state.isSubmitting ||
												createMutation.isPending ||
												updateMutation.isPending
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
				)}
			</DialogContent>
		</Dialog>
	);
}
