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
import { BanIcon, CheckIcon } from "lucide-react";
import { Route } from ".";

export default function UpdateRequestStatus({
	request,
	status,
	children,
	onSuccess,
}: {
	request: { id: string };
	status: "ACCEPTED" | "REJECTED";
	children?: ReactNode;
	onSuccess?: () => void;
}) {
	const { vacancyId } = Route.useParams();
	const [open, setOpen] = useState(false);
	const updateStatusMutation = useMutation(
		orpc.requests.updateStatus.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.requests.getCompany.queryKey({
						input: {
							vacancyId,
						},
					}),
				});
				onSuccess?.();
				toast.success("Статус отклика обновлен");
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
								<span>Пригласить</span>
							</>
						)}
					</DropdownMenuItem>
				)}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{status === "REJECTED" ? "Отклонить" : "Пригласить"}?
					</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Отмена</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							loading={updateStatusMutation.isPending}
							onClick={() => {
								updateStatusMutation.mutate({
									id: request.id,
									status,
								});
							}}
						>
							{status === "REJECTED" ? "Отклонить" : "Пригласить"}
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
