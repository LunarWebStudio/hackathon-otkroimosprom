import { cn } from "@/lib/utils";

export function Block({
	children,
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("flex flex-col rounded-md bg-secondary", className)}
			{...props}
		>
			{children}
		</div>
	);
}

export function BlockHeader({
	children,
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"px-4 py-3 text-muted-foreground uppercase font-medium text-sm",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function BlockContent({
	children,
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex flex-col gap-2 grow p-4 bg-background border rounded-md font-normal",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
