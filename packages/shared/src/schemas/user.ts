import { userRolesEnum } from "@lunarweb/database/schema";
import z from "zod/v4";

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
