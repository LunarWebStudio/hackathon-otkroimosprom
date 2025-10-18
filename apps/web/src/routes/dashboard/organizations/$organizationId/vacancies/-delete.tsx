import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { orpc, queryClient } from "@/utils/orpc";
import type { Vacancy } from "@/lib/types/vacancy";
import { Trash2 } from "lucide-react";

export default function DeleteVacancy({ vacancy }: { vacancy: Vacancy }) {
	const [open, setOpen] = useState(false);
	const deleteVacancyMutation = useMutation(
		orpc.vacancies.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.vacancies.getAll.queryKey(),
				});
				toast.success("Вакансия успешно удалена");
			},
		}),
	);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<DropdownMenuItem
					variant="destructive"
					onSelect={(e) => e.preventDefault()}
				>
					<Trash2 />
					<span>Удалить</span>
				</DropdownMenuItem>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Удалить вакансию?</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Отмена</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							loading={deleteVacancyMutation.isPending}
							onClick={() => {
								deleteVacancyMutation.mutate({ id: vacancy.id });
							}}
						>
							Удалить
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
