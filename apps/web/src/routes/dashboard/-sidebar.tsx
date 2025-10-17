import {
	Link,
	type ResolveParams,
	type ResolveFullSearchSchema,
	type ResolveSearchValidatorInputFn,
	useLocation,
	useRouteContext,
} from "@tanstack/react-router";
import {
	ChartNoAxesCombined,
	LogOutIcon,
	SwatchBookIcon,
	TextInitialIcon,
	UsersIcon,
} from "lucide-react";
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
import Logo from "@/components/logo";

type Block = {
	title: string;
	items: (Item<RoutePath> | undefined)[];
};

type Item<T extends RoutePath> = {
	icon: ReactNode;
	label: string;
	href: T;
	params?: ResolveParams<T> | any; // TODO: fix any and infer types properly
	search?: ResolveFullSearchSchema<T, ResolveSearchValidatorInputFn<T>> | any;
};

function SidebarBlock({ block }: { block: Block }) {
	const items = block.items.filter(Boolean) as Item<RoutePath>[];

	if (items.length === 0) return null;

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarGroupLabel className="font-medium mb-2 text-base text-foreground">
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
					search={item.search}
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

	const blocks: Block[] = [
		{
			title: "Меню",
			items: [
				{
					icon: <UsersIcon />,
					label: "Пользователи",
					href: "/dashboard/users",
				},
				{
					icon: <TextInitialIcon />,
					label: "Вакансии",
					href: "/dashboard/vacancies",
					search: {
						type: "job",
					},
				},
				{
					icon: <SwatchBookIcon />,
					label: "Стажировки",
					href: "/dashboard/positions",
					search: {
						type: "internship",
					},
				},
				{
					icon: <TextInitialIcon />,
					label: "Навыки",
					href: "/dashboard/skills",
				},
								{
					icon: <TextInitialIcon />,
					label: "Специальности",
					href: "/dashboard/specialties",
				},
				{
					icon: <ChartNoAxesCombined />,
					label: "Аналитика",
					href: "/dashboard/analytics",
				},
			],
		},
	];

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
				<SidebarHeader className="mb-6 pt-4">
					<Logo className="w-full" />
				</SidebarHeader>
				<SidebarContent>
					{blocks.map((block) => (
						<SidebarBlock key={block.title} block={block} />
					))}
					<SidebarFooter className="px-0 mt-auto">
						<SidebarGroup>
							<SidebarGroupContent>
								<SidebarMenuButton>
									<Link to={"/"} className="w-full justify-between">
										<span>Обратно на сайт</span>
										<svg
											width="18"
											height="19"
											viewBox="0 0 18 19"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M2.25 14.75V4.25M9.75 5L5.25 9.5M5.25 9.5L9.75 14M5.25 9.5H15.75"
												stroke="#18181B"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
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
