import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	SelectTrigger,
	Select,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { orpc, queryClient } from "@/utils/orpc";
import { EmployeeSchema } from "@lunarweb/shared/schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { PlusCircleIcon, RefreshCcwIcon, SquarePenIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod/v4";
import { userRoleNames, type UserRole } from "@lunarweb/shared/types";
import { Label } from "@/components/ui/label";

export default function CreateEmployee() {
	const [open, setOpen] = useState(false);

	const createUserMutation = useMutation(
		orpc.users.create.mutationOptions({
			onSuccess: async () => {
				setOpen(false);
				toast.success("Пользователь обновлен");
				await queryClient.invalidateQueries({
					queryKey: orpc.users.get.queryKey(),
				});
				form.reset();
			},
		}),
	);

	const form = useForm({
		defaultValues: {} as z.infer<typeof EmployeeSchema>,
		onSubmit: async ({ value }) => {
			createUserMutation.mutate(value);
		},
		validators: {
			onSubmit: EmployeeSchema,
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<PlusCircleIcon />
					Создать
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Создать сотрудника</DialogTitle>
				</DialogHeader>
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
								placeholder="ФИО"
								errors={field.state.meta.errors.map((error) => error?.message)}
							/>
						)}
					</form.Field>
					<form.Field name="role">
						{(field) => (
							<div className="flex flex-col">
								<Label className="">Роль</Label>
								<Select
									value={field.state.value}
									onValueChange={(v) => field.handleChange(v as UserRole)}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Роль" />
									</SelectTrigger>
									<SelectContent>
										{(["HR", "COMPANY_MANAGER"] as UserRole[]).map((r) => (
											<SelectItem key={r} value={r}>
												{userRoleNames[r]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
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
								placeholder="Почта"
								errors={field.state.meta.errors.map((error) => error?.message)}
							/>
						)}
					</form.Field>
					<form.Field name="password">
						{(field) => (
							<div className="flex gap-2 items-center">
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Почта"
									errors={field.state.meta.errors.map(
										(error) => error?.message,
									)}
									className="grow"
								/>
								<Button
									variant="secondary"
									className="size-11 mt-5"
									type="button"
									onClick={() => {
										let pass = "";
										for (let i = 0; i < 2; i++) {
											pass += Math.random().toString(36).substring(2);
										}
										field.handleChange(pass);
									}}
								>
									<RefreshCcwIcon />
								</Button>
							</div>
						)}
					</form.Field>

					<DialogFooter className="grid-cols-1">
						<form.Subscribe>
							{(state) => (
								<Button
									type="submit"
									loading={state.isSubmitting || createUserMutation.isPending}
									disabled={!state.canSubmit}
								>
									Сохранить
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
