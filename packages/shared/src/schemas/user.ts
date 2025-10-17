import { userRolesEnum } from "@lunarweb/database/schema";
import z from "zod/v4";
import type { UserRole } from "../types/user";

export const UserRoleSchema = z.enum(userRolesEnum.enumValues, {
	message: "Выберите роль",
});

export const UserSchema = z.object({
	name: z
		.string({
			message: "Введите имя",
		})
		.min(1, "Введите имя"),
	role: UserRoleSchema,
});

export const EmployeeSchema = z.object({
	name: z
		.string({
			message: "Введите ФИО",
		})
		.min(1, "Введите ФИО"),
	email: z.email({
		message: "Введите почту",
	}),
	role: z.enum(["HR", "COMPANY_MANAGER"] as UserRole[], {
		message: "Выберите роль",
	}),
	password: z
		.string({
			message: "Введите пароль",
		})
		.min(8, "Пароль должен содержать не менее 8 символов"),
});
