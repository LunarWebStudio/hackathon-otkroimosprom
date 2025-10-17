import {
	Link,
	type ResolveParams,
	useLocation,
	useRouteContext,
} from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import type { RoutePath } from "@/lib/types/utils";

type Block = {
	title: string;
	items: (Item<RoutePath> | undefined)[];
};

type Item<T extends RoutePath> = {
	icon: ReactNode;
	label: string;
	href: T;
	params?: ResolveParams<T> | any; // TODO: fix any and infer types properly
};

function SidebarBlock({ block }: { block: Block }) {
	const items = block.items.filter(Boolean) as Item<RoutePath>[];

	if (items.length === 0) return null;

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarGroupLabel className="text-muted-foreground text-base">
					{block.title}
				</SidebarGroupLabel>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarItem key={item.label} item={item} />
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

function SidebarItem({ item }: { item: Item<RoutePath> }) {
	const { pathname } = useLocation();
	const sidebar = useSidebar();

	return (
		<SidebarMenuItem key={item.label}>
			<SidebarMenuButton isActive={pathname === item.href}>
				<Link
					to={item.href}
					params={item.params}
					onClick={() => {
						if (sidebar.isMobile) {
							sidebar.setOpenMobile(false);
						}
					}}
				>
					{item.icon}
					<span>{item.label}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}

export default function DashboardSidebar() {
	const { session } = useRouteContext({
		strict: false,
	});

	const blocks: Block[] = [];

	const sidebar = useSidebar();

	useEffect(() => {
		sidebar.setOpen(true);
	}, [sidebar.isMobile]);

	return (
		<>
			<nav className="lg:hidden fixed top-0 inset-x-0 h-20 bg-white flex justify-between items-center p-4">
				<SidebarTrigger />
				<Link to={"/auth/sign-out"}>
					<LogOutIcon />
				</Link>
			</nav>
			<Sidebar>
				<SidebarHeader className="h-16 border-b border-white/10 flex items-center justify-center">
					LOGO
				</SidebarHeader>
				<SidebarContent>
					{blocks.map((block) => (
						<SidebarBlock key={block.title} block={block} />
					))}
					<SidebarFooter className="px-0 mt-auto">
						<SidebarGroup>
							<SidebarGroupContent>
								<SidebarMenuButton>
									<Link to={"/auth/sign-out"}>
										<LogOutIcon />
										<span>Выход</span>
									</Link>
								</SidebarMenuButton>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarFooter>
				</SidebarContent>
			</Sidebar>
		</>
	);
}
