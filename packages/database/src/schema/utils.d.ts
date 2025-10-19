export declare const genderEnum: import("drizzle-orm/pg-core").PgEnum<["MALE", "FEMALE"]>;
export declare const organizationRequestsStatus: import("drizzle-orm/pg-core").PgEnum<["PENDING", "APPROVED", "REJECTED", "COMPLETED"]>;
export declare const commonFields: {
    id: import("drizzle-orm").HasRuntimeDefault<import("drizzle-orm").HasDefault<import("drizzle-orm").IsPrimaryKey<import("drizzle-orm").NotNull<import("drizzle-orm").NotNull<import("drizzle-orm/pg-core").PgVarcharBuilderInitial<"id", [string, ...string[]], 255>>>>>>;
    serial: import("drizzle-orm").NotNull<import("drizzle-orm/pg-core").PgSerialBuilderInitial<"serial">>;
    createdAt: import("drizzle-orm").HasDefault<import("drizzle-orm").NotNull<import("drizzle-orm/pg-core").PgTimestampBuilderInitial<"created_at">>>;
    deletedAt: import("drizzle-orm/pg-core").PgTimestampBuilderInitial<"deleted_at">;
};
