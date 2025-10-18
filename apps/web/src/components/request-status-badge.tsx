import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

export const organizationStatusBadgeVariants = cva(
	"size-fit py-1 rounded-md px-1.5",
	{
		variants: {
			status: {
				REJECTED: "bg-red-100 text-red-900",
				ACCEPTED: "bg-green-100 text-green-900",
				PENDING: "bg-gray-100 text-gray-900",
			},
		},
	},
);

export interface UserorganizationStatusBadgeProps
	extends React.HTMLAttributes<"div">,
		VariantProps<typeof organizationStatusBadgeVariants> {
	status: "REJECTED" | "ACCEPTED" | "PENDING";
}

export default function RequestStatusBadge({
	status,
	className,
}: UserorganizationStatusBadgeProps) {
	return (
		<div className={cn(organizationStatusBadgeVariants({ status }), className)}>
			{status === "ACCEPTED"
				? "Собеседование"
				: status === "REJECTED"
					? "Отказ"
					: "Ожидает ответ"}
		</div>
	);
}
