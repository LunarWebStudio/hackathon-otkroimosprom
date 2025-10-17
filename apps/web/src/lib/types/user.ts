import type { orpc } from "@/utils/orpc";
import type { UserRole } from "@lunarweb/shared/types";

export type Session = NonNullable<
	Awaited<ReturnType<typeof orpc.user.session.get.call>>
>;

export type User = NonNullable<
	Awaited<ReturnType<typeof orpc.user.get.call>>
>[number];

export const userRoleToString: Record<UserRole, string> = {
	ADMIN: "Администратор",
	USER: "Соискатель",
	HR: "HR компании",
};
