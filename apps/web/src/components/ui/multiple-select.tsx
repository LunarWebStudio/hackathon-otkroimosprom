import { Check } from "lucide-react";
import { useState, type ReactNode } from "react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";

type Item = {
	id: string;
	name: string;
	[key: string]: any;
};

export default function MultpleSelect<T extends Item>({
	values,
	value,
	onChange,
	children,
	modal = false,
	placeholder,
}: {
	values: T[];
	value: T[];
	onChange: (value: T[]) => void;
	placeholder: {
		default: string;
		empty: string;
	};
	modal?: boolean;
	includeNull?: boolean;
	includeAll?: boolean;
	multiple?: boolean;
	children: ReactNode;
}) {
	const [open, setOpen] = useState(false);

	const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

	const handleSelect = (item: T | null) => {
		const newValues = item
			? selectedValues.some((v) => v.id === item.id)
				? selectedValues.filter((v) => v.id !== item.id)
				: [...selectedValues, item]
			: [];
		onChange(newValues.length > 0 ? newValues : []);
	};

	return (
		<Popover open={open} onOpenChange={setOpen} modal={modal}>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent>
				<Command>
					<CommandInput placeholder={placeholder.default} />
					<CommandEmpty className="text-muted-foreground">
						{placeholder.empty}
					</CommandEmpty>

					<CommandList>
						<CommandGroup>
							{values.map((v) => {
								const isSelected = selectedValues.some((sv) => sv.id === v.id);
								return (
									<CommandItem
										value={v.name}
										key={v.id}
										onSelect={() => handleSelect(v)}
									>
										<Check
											className={cn(
												"size-4 mr-1",
												isSelected ? "opacity-100" : "opacity-0",
											)}
										/>
										<span
											className={cn(isSelected ? "opacity-100" : "opacity-50")}
										>
											{v.name}
										</span>
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
