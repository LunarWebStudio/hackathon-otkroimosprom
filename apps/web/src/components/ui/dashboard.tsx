import { cn } from "@/lib/utils";
import {
	useCanGoBack,
	useLocation,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";

export interface DashboardProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
}

export function Dashboard({ className, children, ...props }: DashboardProps) {
	return (
		<div
			className={cn(
				"h-full overflow-hidden bg-background flex flex-col grow shrink",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export interface DashboardHeaderProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
}

export function DashboardHeader({
	className,
	children,
	...props
}: DashboardHeaderProps) {
	return (
		<div
			className={cn(
				"md:flex grid grid-cols-1 min-h-16 gap-4 items-center justify-between px-6 py-3 border-b w-full",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export interface DashboardTitleProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	hideNavigation?: boolean;
	backHref?: string;
}

export function DashboardTitle({
	className,
	children,
	hideNavigation = false,
	backHref,
	...props
}: DashboardTitleProps) {
	const navigate = useNavigate();
	const router = useRouter();
	const path = useLocation();
	const previousPath = path.pathname.split("/").slice(0, -1).join("/");
	const canGoBackHistory = useCanGoBack();
	const canGoBack = canGoBackHistory || !!previousPath;

	return (
		<div className="flex flex-col gap-1">
			{!hideNavigation && canGoBack && (
				<Button
					size="icon"
					className="p-0 size-fit flex items-center gap-1 text-muted-foreground"
					variant="transparent"
					onClick={() => {
						if (backHref) {
							navigate({
								to: backHref,
								replace: true,
							});
						} else if (canGoBackHistory) {
							router.history.back();
						} else {
							navigate({
								to: previousPath!,
								replace: true,
							});
						}
					}}
				>
					<ArrowLeft className="size-4" />
					<span className="text-sm">Назад</span>
				</Button>
			)}

			<div className={cn("flex flex-col", className)} {...props}>
				{children}
			</div>
		</div>
	);
}

export interface DashboardTitleTextProps
	extends React.HTMLAttributes<HTMLHeadElement> {
	children?: ReactNode;
}

export function DashboardTitleText({
	className,
	children,
	...props
}: DashboardTitleTextProps) {
	return (
		<h1 className={cn("font-medium text-xl", className)} {...props}>
			{children}
		</h1>
	);
}

export interface DashboardSubtitleProps
	extends React.HTMLAttributes<HTMLHeadElement> {
	children?: ReactNode;
}

export function DashboardSubtitle({
	className,
	children,
	...props
}: DashboardSubtitleProps) {
	return (
		<h2 className={cn("text-sm text-muted-foreground", className)} {...props}>
			{children}
		</h2>
	);
}

export interface DashboardContentProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
}

export function DashboardContent({
	className,
	children,
	...props
}: DashboardContentProps) {
	return (
		<div
			className={cn(
				"overflow-y-scroll overflow-x-scroll space-y-4 grow p-6",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
