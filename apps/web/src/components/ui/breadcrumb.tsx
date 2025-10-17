import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Link, useRouteContext } from "@tanstack/react-router";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./dropdown-menu";

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
	return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
	return (
		<ol
			data-slot="breadcrumb-list"
			className={cn(
				"text-muted-foreground flex flex-wrap items-center gap-2 text-xl break-words sm:gap-2.5",
				className,
			)}
			{...props}
		/>
	);
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
	return (
		<li
			data-slot="breadcrumb-item"
			className={cn("inline-flex items-center gap-1.5", className)}
			{...props}
		/>
	);
}

function BreadcrumbLink({
	asChild,
	className,
	...props
}: React.ComponentProps<"a"> & {
	asChild?: boolean;
}) {
	const Comp = asChild ? Slot : "a";

	return (
		<Comp
			data-slot="breadcrumb-link"
			className={cn("hover:text-foreground transition-colors", className)}
			{...props}
		/>
	);
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="breadcrumb-page"
			role="link"
			aria-disabled="true"
			aria-current="page"
			className={cn("text-foreground font-normal", className)}
			{...props}
		/>
	);
}

function BreadcrumbSeparator({
	children,
	className,
	...props
}: React.ComponentProps<"li">) {
	return (
		<li
			data-slot="breadcrumb-separator"
			role="presentation"
			aria-hidden="true"
			className={cn("[&>svg]:size-3.5", className)}
			{...props}
		>
			{children ?? "/"}
		</li>
	);
}

function BreadcrumbEllipsis({
	className,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="breadcrumb-ellipsis"
			role="presentation"
			aria-hidden="true"
			className={cn("flex size-9 items-center justify-center", className)}
			{...props}
		>
			<MoreHorizontal className="size-4" />
			<span className="sr-only">More</span>
		</span>
	);
}

export type TBreadCrumbItem = {
	href: string;
	label: string;
};

export function useDynamicBreadcrumbs() {
	const { crumbs } = useRouteContext({ strict: false });

	const items = crumbs ?? [];

	return items;
}

function DynamicBreadcrumbItem({
	href,
	label,
	shouldSeparate,
}: {
	href: string;
	label: string;
	shouldSeparate?: boolean;
}) {
	return (
		<React.Fragment>
			<BreadcrumbItem>
				<BreadcrumbLink asChild>
					<Link to={href}>{label}</Link>
				</BreadcrumbLink>
			</BreadcrumbItem>
			{shouldSeparate && <BreadcrumbSeparator />}
		</React.Fragment>
	);
}

export function BreadcrumbDynamic() {
	const initialItems = useDynamicBreadcrumbs();
	const shouldSlice = initialItems.length > 4;

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{shouldSlice ? (
					<>
						<DynamicBreadcrumbItem
							href={initialItems[0].href}
							label={initialItems[0].label}
						/>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<DropdownMenu>
								<DropdownMenuTrigger className="flex items-center gap-1">
									<BreadcrumbEllipsis className="size-4" />
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="flex flex-col">
									{initialItems.slice(1, -2).map((item, index) => (
										<DropdownMenuItem
											key={item.label + item.href + index.toString()}
										>
											<DynamicBreadcrumbItem
												shouldSeparate={false}
												href={item.href}
												label={item.label}
											/>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<DynamicBreadcrumbItem
							href={initialItems.at(-2)?.href ?? ""}
							label={initialItems.at(-2)?.label ?? ""}
						/>
						<BreadcrumbSeparator />
					</>
				) : (
					initialItems
						.slice(0, -1)
						.map((item, index) => (
							<DynamicBreadcrumbItem
								key={item.label + item.href + index.toString()}
								shouldSeparate={index < initialItems.length - 1}
								href={item.href}
								label={item.label}
							/>
						))
				)}
				<BreadcrumbItem>
					<BreadcrumbPage>{initialItems.at(-1)?.label}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}

export {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
	BreadcrumbEllipsis,
};
