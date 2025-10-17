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
import { type User } from "@/lib/types/user";
import { orpc, queryClient } from "@/utils/orpc";
import { UserSchema } from "@lunarweb/shared/schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { SquarePenIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod/v4";
import { userRolesEnum } from "../../../../../../../packages/database/src/schema/auth";
import { userRoleNames, type UserRole } from "@lunarweb/shared/types";

export default function UpdateUser({ user }: { user: User }) {
	const [open, setOpen] = useState(false);
	const updateUserMutation = useMutation(
		orpc.users.update.mutationOptions({
			onSuccess: async () => {
				setOpen(false);
				toast.success("Пользователь обновлен");
				await queryClient.invalidateQueries({
					queryKey: orpc.users.get.queryKey(),
				});
			},
		}),
	);

	const form = useForm({
		defaultValues: user as z.infer<typeof UserSchema>,
		onSubmit: async ({ value }) => {
			updateUserMutation.mutate({
				...value,
				id: user.id,
			});
		},
		validators: {
			onSubmit: UserSchema,
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
					<SquarePenIcon />
					<span>Редактировать</span>
				</DropdownMenuItem>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Редактировать пользователя</DialogTitle>
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
							<Select
								value={field.state.value}
								onValueChange={(v) => field.handleChange(v as UserRole)}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Роль" />
								</SelectTrigger>
								<SelectContent>
									{(["ADMIN", "USER"] as UserRole[]).map((r) => (
										<SelectItem key={r} value={r}>
											{userRoleNames[r]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					</form.Field>

					<DialogFooter className="grid-cols-1">
						<form.Subscribe>
							{(state) => (
								<Button
									type="submit"
									loading={state.isSubmitting || updateUserMutation.isPending}
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
