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
import type { User } from "@/lib/types/user";
import { Trash2 } from "lucide-react";

export default function DeleteUser({
	user,
	disabled,
}: {
	user: User;
	disabled?: boolean;
}) {
	const [open, setOpen] = useState(false);
	const deleteUserMutation = useMutation(
		orpc.users.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.users.get.queryKey(),
				});
				toast.success("Пользователь успешно удален");
			},
		}),
	);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<DropdownMenuItem
					disabled={disabled}
					variant="destructive"
					onSelect={(e) => e.preventDefault()}
				>
					<Trash2 />
					<span>Удалить</span>
				</DropdownMenuItem>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Удалить пользователя?</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Отмена</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							loading={deleteUserMutation.isPending}
							onClick={() => {
								deleteUserMutation.mutate({ id: user.id });
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
