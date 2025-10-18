import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

export const vacancyStatusBadgeVariants = cva(
	"size-fit py-1 rounded-md px-1.5",
	{
		variants: {
			vacancyStatus: {
				ARCHIVED: "bg-slate-100 text-slate-900",
				ACTIVE: "bg-green-100 text-green-900",
			},
		},
	},
);

export interface UservacancyStatusBadgeProps
	extends React.HTMLAttributes<"div">,
		VariantProps<typeof vacancyStatusBadgeVariants> {
	vacancyStatus: "ARCHIVED" | "ACTIVE";
}

export default function VacancyStatusBadge({
	vacancyStatus,
	className,
}: UservacancyStatusBadgeProps) {
	return (
		<div
			className={cn(vacancyStatusBadgeVariants({ vacancyStatus }), className)}
		>
			{vacancyStatus === "ARCHIVED" ? "Архив" : "Опубликована"}
		</div>
	);
}
