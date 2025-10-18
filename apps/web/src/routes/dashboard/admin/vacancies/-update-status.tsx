import { useMutation } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
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
import { BanIcon, CheckIcon } from "lucide-react";
import type { OrganizationRequestStatus } from "@lunarweb/shared/types";

export default function UpdateVacancyStatus({
	vacancy,
	status,
	children,
	onSuccess,
}: {
	vacancy: Vacancy;
	status: OrganizationRequestStatus;
	children?: ReactNode;
	onSuccess?: () => void;
}) {
	const [open, setOpen] = useState(false);
	const updateStatusMutation = useMutation(
		orpc.vacancies.updateStatus.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.vacancies.getAll.queryKey(),
				});
				onSuccess?.();
				toast.success("Статус компании обновлен");
			},
		}),
	);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				{children ? (
					children
				) : (
					<DropdownMenuItem
						variant={status === "REJECTED" ? "destructive" : "default"}
						onSelect={(e) => e.preventDefault()}
					>
						{status === "REJECTED" ? (
							<>
								<BanIcon />
								<span>Отклонить</span>
							</>
						) : (
							<>
								<CheckIcon />
								<span>Опубликовать</span>
							</>
						)}
					</DropdownMenuItem>
				)}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{status === "REJECTED" ? "Отклонить" : "Опубликовать"} компанию?
					</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Отмена</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							loading={updateStatusMutation.isPending}
							onClick={() => {
								updateStatusMutation.mutate({
									id: vacancy.id,
									status,
								});
							}}
						>
							{status === "REJECTED" ? "Отклонить" : "Опубликовать"}
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
