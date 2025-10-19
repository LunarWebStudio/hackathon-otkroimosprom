import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

export const vacancyStatusBadgeVariants = cva(
	"size-fit py-1 rounded-md px-1.5",
	{
		variants: {
			vacancyStatus: {
				ARCHIVED: "bg-slate-100 text-slate-900",
				REJECTED: "bg-red-100 text-red-900",
				APPROVED: "bg-green-100 text-green-900",
				PENDING: "bg-yellow-100 text-yellow-900",
			},
		},
	},
);

export interface UservacancyStatusBadgeProps
	extends React.HTMLAttributes<"div">,
		VariantProps<typeof vacancyStatusBadgeVariants> {
	vacancyStatus: "ARCHIVED" | "APPROVED" | "PENDING" | "REJECTED";
}

export default function VacancyStatusBadge({
	vacancyStatus,
	className,
}: UservacancyStatusBadgeProps) {
	return (
		<div
			className={cn(vacancyStatusBadgeVariants({ vacancyStatus }), className)}
		>
			{vacancyStatus === "ARCHIVED"
				? "Архив"
				: vacancyStatus === "REJECTED"
					? "Отклонена"
					: vacancyStatus === "APPROVED"
						? "Опубликована"
						: "Модерация"}
		</div>
	);
}
