import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orpc } from "@/utils/orpc";
import { OrganizationSchema } from "@lunarweb/shared/schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type z from "zod/v4";

export default function CreateOrganizationForm() {
	const createOrganizationMutation = useMutation(
		orpc.organizations.create.mutationOptions({
			onSuccess: async () => {
				toast.success("Заявка отправлена");
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
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				void form.handleSubmit();
			}}
			className="space-y-4"
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
						errors={field.state.meta.errors.map((error) => error?.message)}
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
						errors={field.state.meta.errors.map((error) => error?.message)}
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
						errors={field.state.meta.errors.map((error) => error?.message)}
					/>
				)}
			</form.Field>
			<form.Field name="kpp">
				{(field) => (
					<Input
						id={field.name}
						name={field.name}
						value={field.state.value ?? ""}
						onBlur={field.handleBlur}
						onChange={(e) => field.handleChange(e.target.value)}
						placeholder="КПП"
						errors={field.state.meta.errors.map((error) => error?.message)}
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
						errors={field.state.meta.errors.map((error) => error?.message)}
					/>
				)}
			</form.Field>
			<form.Field name="lawAddress">
				{(field) => (
					<Input
						id={field.name}
						name={field.name}
						value={field.state.value ?? ""}
						onBlur={field.handleBlur}
						onChange={(e) => field.handleChange(e.target.value)}
						placeholder="Юридический адрес"
						errors={field.state.meta.errors.map((error) => error?.message)}
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
						errors={field.state.meta.errors.map((error) => error?.message)}
					/>
				)}
			</form.Field>
			<form.Subscribe>
				{(state) => (
					<Button
						type="submit"
						disabled={!state.canSubmit}
						loading={state.isSubmitting || createOrganizationMutation.isPending}
					>
						Создать
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}
