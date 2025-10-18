import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogInnerContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { Organization } from "@/lib/types/organization";
import { organizationRequestStatusNames } from "@lunarweb/shared/types";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import UpdateOrganizationStatus from "./-update-status";
import { useState } from "react";

export default function OrganizationInfo({
	organization,
}: {
	organization: Organization;
}) {
	const [open, setOpen] = useState(false);

	const blocks: {
		label: string;
		value: string | undefined;
	}[] = [
		{
			label: "id",
			value: organization.serial,
		},
		{
			label: "Название",
			value: organization.name,
		},
		{
			label: "ИНН",
			value: organization.inn,
		},
		{
			label: "ОРГН/ОРГНИП",
			value: organization.orgn,
		},
		{
			label: "КПП",
			value: organization.kpp,
		},
		{
			label: "Адрес",
			value: organization.address,
		},
		{
			label: "Статус",
			value: organizationRequestStatusNames[organization.status],
		},
	].filter((b) => b.value);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<DropdownMenuItem
					className="flex gap-2 items-center"
					onSelect={(e) => e.preventDefault()}
				>
					<SquareArrowOutUpRightIcon />
					<span>Просмотреть</span>
				</DropdownMenuItem>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Просмотреть компанию</DialogTitle>
				</DialogHeader>
				<DialogInnerContent className="flex flex-col gap-2">
					{blocks.map((block) => (
						<div
							className="flex flex-col pb-2 border-b"
							key={block.label + organization.id}
						>
							<p className="text-muted-foreground text-sm">{block.label}</p>
							<p>{block.value}</p>
						</div>
					))}
				</DialogInnerContent>
				<DialogFooter>
					<UpdateOrganizationStatus
						onSuccess={() => setOpen(false)}
						status="REJECTED"
						organization={organization}
					>
						<Button variant="destructive">Отклонить</Button>
					</UpdateOrganizationStatus>
					<UpdateOrganizationStatus
						onSuccess={() => setOpen(false)}
						status="APPROVED"
						organization={organization}
					>
						<Button variant="approved">Опубликовать</Button>
					</UpdateOrganizationStatus>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
