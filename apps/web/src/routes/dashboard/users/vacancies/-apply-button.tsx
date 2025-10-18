import { Button } from "@/components/ui/button";
import { orpc } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ApplyButton({ vacancy }: { vacancy: { id: string } }) {
	const applyMutation = useMutation(
		orpc.requests.create.mutationOptions({
			onSuccess: () => {
				toast.success("Отклик отправлен");
			},
		}),
	);

	return (
		<Button
			className="size-fit"
			onClick={() => {
				applyMutation.mutate({
					vacancyId: vacancy.id,
				});
			}}
		>
			Откликнуться
		</Button>
	);
}
