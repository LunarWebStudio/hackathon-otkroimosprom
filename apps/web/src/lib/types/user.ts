import type { orpc } from "@/utils/orpc";

export type Session = NonNullable<
	Awaited<ReturnType<typeof orpc.users.session.get.call>>
>;

export type User = NonNullable<
	Awaited<ReturnType<typeof orpc.users.get.call>>
>[number];
