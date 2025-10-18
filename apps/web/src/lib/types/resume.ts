import type { orpc } from "@/utils/orpc";

export type Resume = NonNullable<
	Awaited<ReturnType<typeof orpc.resume.getAll.call>>
>[number];
