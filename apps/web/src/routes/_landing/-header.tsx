import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { HeaderLogo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { Search, User, User2 } from "lucide-react";

export const headerItems = [
	{
		label: "ОЭЗ",
		href: "#",
		items: [
			{ label: "Официально об ОЭЗ", href: "/oae/ofitsialno-ob-oez/" },
			{ label: "Преференции и льготы", href: "/oae/preferentsii-i-lgoty/" },
			{ label: "Как стать резидентом", href: "/oae/kak-stat-rezidentom/" },
			{ label: "Сделано в ОЭЗ", href: "/oae/sdelano-v-oez/" },
			{ label: "Устойчивое развитие", href: "/oae/ustoychivoe-razvitie/" },
		],
	},
	{
		label: "Площадки",
		href: "#",
		items: [
			{ label: "Печатники", href: "/ploshchadki/pechatniki/" },
			{ label: "Алабушево", href: "/ploshchadki/alabushevo/" },
			{ label: "Руднево", href: "/ploshchadki/rudnevo/" },
			{ label: "Микрон", href: "/ploshchadki/mikron/" },
			{ label: "Ангстрем", href: "/ploshchadki/angstrem/" },
			{ label: "МИЭТ", href: "/ploshchadki/miet/" },
		],
	},
	{
		label: "Услуги",
		href: "#",
		items: [
			{
				label: "Инфраструктура и сервисы",
				href: "/uslugi/infrastruktura-i-servisy/",
			},
			{
				label: "Центр коллективного пользования",
				href: "/uslugi/tsentr-kollektivnogo-polzovaniya/",
			},
			{ label: "Логистический центр", href: "/uslugi/logisticheskiy-tsentr/" },
			{
				label: "Аренда конгресс-центров",
				href: "/uslugi/arenda-kongress-tsentrov/",
			},
			{
				label: "Личный кабинет резидента",
				href: "https://lk-new.technomoscow.ru/",
			},
		],
	},
	{
		label: "Мероприятия",
		href: "#",
		items: [
			{ label: "Афиша", href: "/meropriyatiya/afisha/" },
			{
				label: "Конгресс-Центр «Алабушево»",
				href: "/meropriyatiya/kongress-tsentr-alabushevo/",
			},
			{
				label: "Конгресс-Центр «Печатники»",
				href: "/meropriyatiya/kongress-tsentr-pechatniki/",
			},
			{
				label: "Конгресс-Центр «Руднево»",
				href: "/meropriyatiya/kongress-tsentr-rudnevo/",
			},
			{
				label: "Прошедшие мероприятия",
				href: "/meropriyatiya/proshedshie-meropriyatiya/",
			},
			{ label: "Экскурсии", href: "/tech-tourism/" },
		],
	},
	{
		label: "Резиденты",
		href: "#",
		items: [
			{ label: "Резиденты", href: "/rezidenty/" },
			{ label: "Полезные контакты", href: "/rezidenty/poleznye-kontakty/" },
		],
	},
	{
		label: "Карьера в ОЭЗ",
		href: "#",
		items: [
			{ label: "Вакансии", href: "/jobs" },
			{
				label: "Стажировки",
				href: "/tech-work/internships/",
			},
		],
	},
	{
		label: "Пресс-центр",
		href: "#",
		items: [
			{ label: "Новости", href: "/press-tsentr/novosti/" },
			{ label: "СМИ о нас", href: "/press-tsentr/smi-o-nas/" },
			{ label: "Фото и видео", href: "/press-tsentr/foto-i-video/" },
			{ label: "Фирменный стиль", href: "/press-tsentr/firmennyy-stil/" },
		],
	},
];

export function Header() {
	const navigate = useNavigate();

	return (
		<div className="fixed w-full py-2.5 flex flex-row justify-center items-center top-0 z-50 px-8 bg-white shadow-lg gap-12">
			<HeaderLogo />

			<div className="flex flex-row gap-6 relative">
				{headerItems.map((item) => (
					<HoverCard key={item.label} openDelay={100} closeDelay={100}>
						<div className=" group">
							<HoverCardTrigger asChild>
								<a
									href={item.href}
									className={cn(
										"cursor-pointer text-[#393649] text-base font-normal tracking-normal group-hover:text-primary hover:underline",
									)}
								>
									{item.label}
								</a>
							</HoverCardTrigger>
							{item.items?.length > 0 && (
								<HoverCardContent
									align="start"
									side="bottom"
									className="bg-white shadow-lg w-fit flex flex-col p-0 z-50 rounded-none border border-gray-200 mt-2"
								>
									{item.items.map((sub) => (
										<a
											key={sub.label}
											href={sub.href}
											className="px-4 py-2 text-sm text-black hover:text-primary transition-colors"
										>
											{sub.label}
										</a>
									))}
								</HoverCardContent>
							)}
						</div>
					</HoverCard>
				))}
			</div>

			<div className="flex flex-row items-center gap-4 ml-10">
				<a
					href="tel:+74956470818"
					className="text-[#393649] text-base font-normal whitespace-nowrap"
				>
					+7 495 647 08 18
				</a>

				<div className="flex flex-row items-center gap-2">
					<a
						href="https://technomoscow.com/"
						className="text-[#393649] text-sm"
					>
						EN
					</a>
					<div className="text-[#393649] opacity-60">|</div>
					<div className="text-primary text-sm font-semibold">RU</div>
				</div>

				<Button
					className="bg-primary rounded-full p-1 aspect-square h-10 w-10 flex items-center justify-center hover:bg-red-900"
					onClick={() => (window.location.href = "/dashboard")}
				>
					<User2 className="text-white" size={26} strokeWidth={1} />
				</Button>

				<Button
					className="w-5 h-5 bg-[url('/icons/search.svg')] bg-no-repeat bg-center"
					aria-label="Поиск"
					variant={"transparent"}
				>
					<Search className="text-black/15" />
				</Button>
			</div>
		</div>
	);
}
