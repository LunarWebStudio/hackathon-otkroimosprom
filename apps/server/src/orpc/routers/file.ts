import { GetFileMetadata, s3, UploadFile } from "@lunarweb/files";
import Elysia, { t } from "elysia";
import { publicProcedure, roleProcedure } from "../orpc";
import { db } from "@lunarweb/database";
import { files } from "@lunarweb/database/schema";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";
import { desc, eq, isNull } from "drizzle-orm";
import z from "zod/v4";
import type { UserRole } from "@lunarweb/shared/types";
import { ORPCError } from "@orpc/server";

export const fileRouter = new Elysia({ prefix: "/file" })
	.get(
		"/:id",
		async ({ params, set }) => {
			const meta = await GetFileMetadata(params.id);
			if (!meta) throw new ORPCError("NOT_FOUND");

			set.headers["Content-Type"] = meta.contentType;
			set.headers["Content-Disposition"] =
				`attachment; filename="${encodeURIComponent(meta.fileName)}"`;

			const s3File = s3.file(meta.id);

			return new Response(s3File.stream(), {
				headers: {
					"Content-Type": meta.contentType,
					"Content-Disposition": `attachment; filename="${encodeURIComponent(meta.fileName)}"`,
				},
			});
		},
		{
			params: t.Object({
				id: t.String(),
			}),
		},
	)
	.post(
		"/",
		async ({ body }) => {
			return {
				id: await UploadFile({
					file: body.file,
					isImage: body.isImage === "true",
				}),
			};
		},
		{
			body: t.Object({
				file: t.File(),
				isImage: t.String(),
				isRestricted: t.String(),
				typeId: t.Optional(t.String()),
			}),
		},
	);

export const orpcFileRouter = {
	get: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.handler(async ({ input, context }) => {
			const meta = await GetFileMetadata(input.id);

			if (!meta) throw new ORPCError("NOT_FOUND");

			const s3File = s3.file(meta.id);

			return {
				id: meta.id,
				contentType: meta.contentType,
				fileName: meta.fileName,
				size: (await s3File.stat()).size,
			};
		}),
	update: publicProcedure
		.input(
			z.object({
				id: z.string(),
				fileName: z.string(),
				typeId: z.string().nullish(),
			}),
		)
		.handler(async ({ input, context }) => {
			const [file] = await db
				.update(files)
				.set(input)
				.where(eq(files.id, input.id))
				.returning();
			await InvalidateCached(["FileMetadata", input.id]);
		}),
};
