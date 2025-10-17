import { cn } from "@/lib/utils";
import { userRoleNames, type UserRole } from "@lunarweb/shared/types";
import { cva, type VariantProps } from "class-variance-authority";

export const roleBadgeVariants = cva("size-fit py-1 rounded-md px-1.5", {
	variants: {
		role: {
			ADMIN: "bg-red-100 text-red-900",
			USER: "bg-blue-100 text-blue-900",
			HR: "bg-purple-100 text-purple-900",
		} as Record<UserRole, string>,
	},
});

export interface UserRoleBadgeProps
	extends React.HTMLAttributes<"div">,
		VariantProps<typeof roleBadgeVariants> {
	role: UserRole;
}

export default function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
	return (
		<div className={cn(roleBadgeVariants({ role }), className)}>
			{userRoleNames[role]}
		</div>
	);
}
