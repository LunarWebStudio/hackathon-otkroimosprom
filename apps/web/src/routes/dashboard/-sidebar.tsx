import {
	Link,
	type ResolveFullSearchSchema,
	type ResolveParams,
	type ResolveSearchValidatorInputFn,
	useLocation,
	useParams,
	useRouteContext,
	useSearch,
} from "@tanstack/react-router";
import {
	BriefcaseBusiness,
	ChartNoAxesCombined,
	GraduationCap,
	HotelIcon,
	LogOutIcon,
	MessageSquareShare,
	Plus,
	SwatchBookIcon,
	TextInitialIcon,
	User,
	UserPlusIcon,
	Users,
	UsersIcon,
} from "lucide-react";
import { type ReactNode, useEffect } from "react";
import Logo from "@/components/logo";
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
	const { organizationId } = useParams({ strict: false });
	const sidebar = useSidebar();
	const search = useSearch({
		strict: false,
	});

	const isSearchEqual = (() => {
		if (!item.search) return true;
		if (!search) return false;
		const itemSearch = item.search as Record<string, unknown>;
		const searchKeys = Object.keys(search);
		return searchKeys.every((key) => itemSearch[key] === search[key]);
	})();

	return (
		<SidebarMenuItem key={item.label}>
			<SidebarMenuButton
				isActive={
					pathname ===
						`${item.href.replace("$organizationId", organizationId ?? "INVALID")}` &&
					isSearchEqual
				}
			>
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

	const adminBlocks: Block[] = [
		{
			title: "Меню",
			items: [
				{
					icon: <UsersIcon />,
					label: "Пользователи",
					href: "/dashboard/admin/users",
				},
				{
					icon: <SwatchBookIcon />,
					label: "Компании",
					href: "/dashboard/admin/organizations",
				},
				{
					icon: <TextInitialIcon />,
					label: "Навыки",
					href: "/dashboard/admin/skills",
				},
				{
					icon: <TextInitialIcon />,
					label: "Специальности",
					href: "/dashboard/admin/specialties",
				},
				{
					icon: <UsersIcon />,
					label: "Вакансии",
					href: "/dashboard/admin/vacancies",
					search: {
						vacancyType: "JOB",
					},
				},
				{
					icon: <UsersIcon />,
					label: "Стажировки",
					href: "/dashboard/admin/vacancies",
					search: {
						vacancyType: "INTERNSHIP",
					},
				},
				{
					icon: <ChartNoAxesCombined />,
					label: "Аналитика",
					href: "/dashboard/analytics",
				},
			],
		},
	];

	const hrBlocks: Item<RoutePath>[] = [
		{
			icon: <HotelIcon />,
			label: "Стажировки",
			href: "/dashboard/organizations/$organizationId/vacancies",
			params: {
				organizationId: session?.user.organizationId,
			},
			search: {
				vacancyType: "INTERNSHIP",
			},
		},
		{
			icon: <UsersIcon />,
			label: "Вакансии",
			href: "/dashboard/organizations/$organizationId/vacancies",
			params: {
				organizationId: session?.user.organizationId,
			},
			search: {
				vacancyType: "JOB",
			},
		},
	];

	const companyManagerBlocks: Item<RoutePath>[] = [
		// {
		// 	icon: <HotelIcon />,
		// 	label: "Компания",
		// 	href: "/dashboard/organizations/$organizationId",
		// 	params: {
		// 		organizationId: session?.user.organizationId,
		// 	},
		// },
		{
			icon: <UsersIcon />,
			label: "Сотрудники",
			href: "/dashboard/organizations/$organizationId/employees",
			params: {
				organizationId: session?.user.organizationId,
			},
		},
	];

	const userBlocks: Item<RoutePath>[] = [
		{
			icon: <User />,
			label: "Резюме",
			href: "/dashboard/users/$userId/resume",
			params: {
				userId: session?.user.id,
			},
		},
		{
			icon: <MessageSquareShare />,
			label: "Отклики",
			href: "/dashboard/users/$userId/requests",
			params: {
				userId: session?.user.id,
			},
		},
		{
			icon: <BriefcaseBusiness />,
			label: "Вакансии",
			href: "/dashboard/users/vacancies",
			search: {
				vacancyType: "job",
			},
		},
		{
			icon: <GraduationCap />,
			label: "Стажировки",
			href: "/dashboard/users/vacancies",
			search: {
				vacancyType: "internship",
			},
		},
		{
			icon: <Plus />,
			label: "Создать компанию",
			href: "/organizations/create",
		},
	];

	const blocks = (() => {
		if (session?.user.role === "ADMIN") {
			return adminBlocks;
		}

		if (
			session?.user.role === "HR" ||
			session?.user.role === "COMPANY_MANAGER"
		) {
			return [
				{
					title: "Меню",
					items: [
						...hrBlocks,
						...(session?.user.role === "COMPANY_MANAGER"
							? companyManagerBlocks
							: []),
					],
				},
			];
		}

		if (session?.user.role === "USER") {
			return [
				{
					title: "Меню",
					items: [...userBlocks],
				},
			];
		}

		return [];
	})();

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
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
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
