import type { organizationRequestsStatus } from "@lunarweb/database/schema";

export type OrganizationRequestStatus =
	(typeof organizationRequestsStatus.enumValues)[number];

export const organizationRequestStatusNames: Record<
	OrganizationRequestStatus,
	string
> = {
	PENDING: "Модерация",
	APPROVED: "Опубликована",
	REJECTED: "Отклонена",
	COMPLETED: "Завершена",
};
