import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

function getStatusBasedOnCompatabilityRating(
	compatabilityRating: number,
): "SUCCESS" | "WARNING" | "FAILURE" {
	if (compatabilityRating >= 0.85) {
		return "SUCCESS";
	}

	if (compatabilityRating >= 0.65) {
		return "WARNING";
	}

	return "FAILURE";
}

export const compatabilityBadgeVariants = cva(
	"size-fit py-1 rounded-md px-1.5",
	{
		variants: {
			compatability: {
				SUCCESS: "bg-green-100 text-green-900",
				WARNING: "bg-yellow-100 text-yellow-900",
				FAILURE: "bg-red-100 text-red-900",
			},
		},
	},
);

export interface CompatabilityBadgeProps
	extends React.HTMLAttributes<"div">,
		VariantProps<typeof compatabilityBadgeVariants> {
	percentage: number;
}

export default function CompatabilityBadge({
	percentage,
	className,
}: CompatabilityBadgeProps) {
	return (
		<div
			className={cn(
				compatabilityBadgeVariants({
					compatability: getStatusBasedOnCompatabilityRating(percentage),
				}),
				className,
			)}
		>
			Подходит на {percentage * 100}%
		</div>
	);
}
