import { BreadcrumbDynamic } from "@/components/ui/breadcrumb";
import {
	Dashboard,
	DashboardContent,
	DashboardHeader,
	DashboardTitle,
} from "@/components/ui/dashboard";
import { createFileRoute } from "@tanstack/react-router";
import { FileSvg } from "./-fileSvg";
import { CreateUpdateResume } from "./-createUpdate";
import type { Resume } from "@/lib/types/resume";
import { Block, BlockContent, BlockHeader } from "@/components/ui/blocks";
import Image from "@/components/ui/image";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/dashboard/users/$userId/resume/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		return {
			resumes: await context.orpc.resume.getAll.call(),
			skills: await context.orpc.skills.getAll.call(),
			specialties: await context.orpc.specialties.getAll.call(),
		};
	},
});

function RouteComponent() {
	const { resumes, skills, specialties } = Route.useLoaderData();

	return (
		<Dashboard>
			<DashboardHeader>
				<DashboardTitle hideNavigation>
					<BreadcrumbDynamic />
				</DashboardTitle>
			</DashboardHeader>
			<DashboardContent className="flex items-center justify-center">
				{resumes.length === 0 ? (
					<div className="w-fit items-center flex flex-col gap-4">
						<div className="bg-zinc-100 rounded-[8px] py-1.5 px-2.5 w-fit">
							<FileSvg />
						</div>
						<p className="text-center text-zinc-500 text-sm font-normal">
							У вас пока нет резюме. <br />
							Нажмите, чтобы создать или загрузить файл
						</p>
						<CreateUpdateResume
							skills={skills ?? []}
							specialties={specialties ?? []}
						/>
					</div>
				) : (
					<ResumeCard resume={resumes[0]} />
				)}
			</DashboardContent>
		</Dashboard>
	);
}

function ResumeCard({ resume }: { resume: Resume }) {
	const { data: skills } = useQuery(orpc.skills.getAll.queryOptions());

	return (
		<div className="flex flex-col gap-4 grow min-h-full">
			<Block className="w-full">
				<BlockHeader>Основная информация</BlockHeader>
				<BlockContent className="p-0">
					<div className="px-4 py-2 border-b">
						<div className="flex items-center gap-4">
							{resume.fileId && <Image src={resume.fileId} alt={resume.name} />}
							<div className="flex flex-col">
								<p className="text-xl">{resume.title}</p>
								<p>{resume.name}</p>
							</div>
						</div>
					</div>
					<div className="px-4 pb-4 flex flex-col gap-1">
						<p className="text-muted-foreground">Личные</p>
						<p>{format(resume.createdAt, "dd.MM.yyyy")}</p>
						<p>{resume.gender === "MALE" ? "Мужчина" : "Женщина"}</p>
						<p>Гражданство: {resume.citizenship}</p>
					</div>
				</BlockContent>
			</Block>
			<Block className="w-full">
				<BlockHeader>контакты</BlockHeader>
				<BlockContent className="p-0">
					<div className="px-4 py-2 border-b">
						<div className="flex flex-col">
							<p className="text-muted-foreground">Мобильный иелефон</p>
							<p>{resume.phoneNumber}</p>
						</div>
					</div>
					<div className="px-4 pb-4 flex flex-col gap-1">
						<p className="text-muted-foreground">Почта</p>
						<p>{resume.email}</p>
					</div>
				</BlockContent>
			</Block>
		</div>
	);
}
