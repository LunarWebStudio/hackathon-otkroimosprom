import { cn } from "@/lib/utils";
import {
	organizationRequestStatusNames,
	type OrganizationRequestStatus,
} from "@lunarweb/shared/types";
import { cva, type VariantProps } from "class-variance-authority";

export const organizationStatusBadgeVariants = cva(
	"size-fit py-1 rounded-md px-1.5",
	{
		variants: {
			organizationStatus: {
				REJECTED: "bg-red-100 text-red-900",
				APPROVED: "bg-green-100 text-green-900",
				PENDING: "bg-yellow-100 text-yellow-900",
			} as Record<OrganizationRequestStatus, string>,
		},
	},
);

export interface UserorganizationStatusBadgeProps
	extends React.HTMLAttributes<"div">,
		VariantProps<typeof organizationStatusBadgeVariants> {
	organizationStatus: OrganizationRequestStatus;
}

export default function UserorganizationStatusBadge({
	organizationStatus,
	className,
}: UserorganizationStatusBadgeProps) {
	return (
		<div
			className={cn(
				organizationStatusBadgeVariants({ organizationStatus }),
				className,
			)}
		>
			{organizationRequestStatusNames[organizationStatus]}
		</div>
	);
}
