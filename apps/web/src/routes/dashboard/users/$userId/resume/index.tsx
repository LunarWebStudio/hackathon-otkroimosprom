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
import { Block, BlockHeader } from "@/components/ui/blocks";

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
	return (
		<div className="flex flex-col gap-4">
			<Block>
				<BlockHeader>Основная информация</BlockHeader>
			</Block>
		</div>
	);
}
