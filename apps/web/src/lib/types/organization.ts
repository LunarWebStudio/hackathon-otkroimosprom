import type { orpc } from "@/utils/orpc";

export type Organization = NonNullable<
	Awaited<ReturnType<typeof orpc.organizations.get.call>>
>[number];
