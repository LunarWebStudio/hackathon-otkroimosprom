import type { orpc } from "@/utils/orpc";

export type Skill = NonNullable<
	Awaited<ReturnType<typeof orpc.skills.getAll.call>>
>[number];
