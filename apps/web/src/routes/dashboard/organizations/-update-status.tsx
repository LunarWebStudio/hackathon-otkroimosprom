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
import type { Organization } from "@/lib/types/organization";
import type { OrganizationRequestStatus } from "@lunarweb/shared/types";
import { BanIcon, CheckIcon, TicketIcon, Trash2 } from "lucide-react";

export default function UpdateOrganizationStatus({
	organization,
	status,
}: {
	organization: Organization;
	status: OrganizationRequestStatus;
}) {
	const [open, setOpen] = useState(false);
	const deleteOrganizationMutation = useMutation(
		orpc.organizations.updateStatus.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.organizations.get.queryKey({
						input: {
							showAll: true,
						},
					}),
				});
				toast.success("Статус компании обновлен");
			},
		}),
	);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
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
							loading={deleteOrganizationMutation.isPending}
							onClick={() => {
								deleteOrganizationMutation.mutate({
									id: organization.id,
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
