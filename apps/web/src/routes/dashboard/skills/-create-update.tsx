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
import type { Skill } from "@/lib/types/skill";
import { orpc, queryClient } from "@/utils/orpc";
import { SkillSchema } from "@lunarweb/shared/schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { SquarePenIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod/v4";

export default function CreateUpdateSkill({ skill }: { skill?: Skill }) {
	const [open, setOpen] = useState(false);
	const updateSkillMutation = useMutation(
		orpc.skills.update.mutationOptions({
			onSuccess: async () => {
				setOpen(false);
				toast.success("Навык обновлен");
				await queryClient.invalidateQueries({
					queryKey: orpc.skills.getAll.queryKey(),
				});
			},
		}),
	);

	const createSkillMutation = useMutation(
		orpc.skills.create.mutationOptions({
			onSuccess: async () => {
				setOpen(false);
				toast.success("Навык создан");
				await queryClient.invalidateQueries({
					queryKey: orpc.skills.getAll.queryKey(),
				});
			},
		}),
	);

	const form = useForm({
		defaultValues: skill as z.infer<typeof SkillSchema>,
		onSubmit: async ({ value }) => {
			if (skill) {
				updateSkillMutation.mutate({
					...value,
					id: skill.id,
				});
			} else {
				createSkillMutation.mutate({
					...value,
				});
			}
		},
		validators: {
			onSubmit: SkillSchema,
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{skill ? (
					<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
						<SquarePenIcon />
						<span>Редактировать</span>
					</DropdownMenuItem>
				) : (
					<Button>Создать</Button>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{skill ? "Редактировать" : "Создать"} навык</DialogTitle>
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
								placeholder="Название"
								errors={field.state.meta.errors.map((error) => error?.message)}
							/>
						)}
					</form.Field>
					<DialogFooter className="grid-cols-1">
						<form.Subscribe>
							{(state) => (
								<Button
									type="submit"
									loading={
										state.isSubmitting ||
										updateSkillMutation.isPending ||
										createSkillMutation.isPending
									}
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
