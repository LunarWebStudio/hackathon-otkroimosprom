import type { userRolesEnum } from "@lunarweb/database/schema";

export type UserRole = (typeof userRolesEnum.enumValues)[number];

export const userRoleNames: Record<UserRole, string> = {
	ADMIN: "Администратор",
	USER: "Соискатель",
	HR: "HR компании",
	COMPANY_MANAGER: "Менеджер компании",
};
