import type { orpc } from "@/utils/orpc";

export type Specialty = NonNullable<
    Awaited<ReturnType<typeof orpc.specialties.getAll.call>>
>[number];