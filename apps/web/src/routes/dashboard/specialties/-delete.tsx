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
import type { Specialty } from "@/lib/types/specialty";
import { Trash2 } from "lucide-react";

export default function DeleteSkill({ specialty }: { specialty: Specialty }) {
    const [open, setOpen] = useState(false);
    const deleteSkillMutation = useMutation(
        orpc.specialties.delete.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: orpc.specialties.getAll.queryKey(),
                });
                toast.success("Специальность успешно удалена");
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
                    <AlertDialogTitle>Удалить специальность?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            loading={deleteSkillMutation.isPending}
                            onClick={() => {
                                deleteSkillMutation.mutate({ id: specialty.id });
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
