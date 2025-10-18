import type { orpc } from "@/utils/orpc";

export type FileType = NonNullable<
	Awaited<ReturnType<typeof orpc.files.types.get.call>>
>[number];

export type FileMetadata = NonNullable<
	Awaited<ReturnType<typeof orpc.files.get.call>>
>;
