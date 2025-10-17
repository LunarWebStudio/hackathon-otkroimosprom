import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orpc } from "@/utils/orpc";
import { OrganizationSchema } from "@lunarweb/shared/schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type z from "zod/v4";
import Logo from "@/components/logo";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organizations/create/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [wasSent, setWasSent] = useState(false);

	const createOrganizationMutation = useMutation(
		orpc.organizations.create.mutationOptions({
			onSuccess: async () => {
				setWasSent(true);
			},
		}),
	);

	const form = useForm({
		defaultValues: {} as z.infer<typeof OrganizationSchema>,
		onSubmit: async ({ value }) => {
			createOrganizationMutation.mutate(value);
		},
		validators: {
			onSubmit: OrganizationSchema,
		},
	});

	return (
		<div
			className="h-svh w-screen relative bg-cover flex items-center justify-center"
			style={{
				backgroundImage: "url('/background.png')",
			}}
		>
			<div
				className={cn(
					"bg-white rounded-lg p-6 absolute right-1/2 bottom-1/2 translate-y-1/2 shadow-md max-w-sm w-full gap-6 max-h-[90vh] overflow-y-scroll space-y-6 transition duration-500",
					!wasSent
						? "-translate-x-full scale-150 opacity-0 pointer-events-none"
						: "translate-x-0 translate-x-1/2 scale-100 opacity-100",
				)}
			>
				<div className="flex flex-col gap-4">
					<Logo className="" />
					<div className="space-y-1">
						<p className="font-medium">Заявка отправлена</p>
						<p className="text-sm text-muted-foreground">
							Спасибо! Ваша заявка успешно отправлена на модерацию.
						</p>
					</div>
					<Link to="/" className="mx-auto">
						<Button>Вернуться на сайт</Button>
					</Link>
				</div>
			</div>
			<div
				className={cn(
					"bg-white rounded-lg p-6 shadow-md max-w-3xl w-full gap-6 max-h-[90vh] overflow-y-scroll space-y-6 transition duration-500",
					wasSent
						? "translate-x-full scale-50 opacity-0 pointer-events-none-"
						: "translate-x-0 scale-100 opacity-100",
				)}
			>
				<div className="grid grid-cols-2">
					<div className="flex flex-col gap-4">
						<Logo className="" />
						<div className="space-y-1">
							<p className="font-medium">
								Отправка заявки на создание компании
							</p>
							<p className="text-sm text-muted-foreground">
								Предоставьте информацию о компании для одобрения модератором ОЭЗ
							</p>
						</div>
					</div>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						void form.handleSubmit();
					}}
					className="space-y-4 w-full grid grid-cols-2 gap-4"
				>
					<div className="flex flex-col gap-4">
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
						<form.Field name="inn">
							{(field) => (
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="ИНН"
									errors={field.state.meta.errors.map(
										(error) => error?.message,
									)}
								/>
							)}
						</form.Field>
						<form.Field name="orgn">
							{(field) => (
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="ОРГН/ОРГНИП"
									errors={field.state.meta.errors.map(
										(error) => error?.message,
									)}
								/>
							)}
						</form.Field>
					</div>

					<div className="flex flex-col gap-4">
						<form.Field name="kpp">
							{(field) => (
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value ?? ""}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="КПП"
									errors={field.state.meta.errors.map(
										(error) => error?.message,
									)}
								/>
							)}
						</form.Field>
						<form.Field name="address">
							{(field) => (
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value ?? ""}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Адрес"
									errors={field.state.meta.errors.map(
										(error) => error?.message,
									)}
								/>
							)}
						</form.Field>
						<form.Field name="contacts">
							{(field) => (
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value ?? ""}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Контакты"
									errors={field.state.meta.errors.map(
										(error) => error?.message,
									)}
								/>
							)}
						</form.Field>
					</div>
					<div />
					<div className="flex justify-end items-end">
						<form.Subscribe>
							{(state) => (
								<Button
									type="submit"
									disabled={!state.canSubmit}
									loading={
										state.isSubmitting || createOrganizationMutation.isPending
									}
								>
									Создать
								</Button>
							)}
						</form.Subscribe>
					</div>
				</form>
			</div>
		</div>
	);
}
