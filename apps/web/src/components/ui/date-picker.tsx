import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { ru } from "date-fns/locale";
import { forwardRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const DatePicker = forwardRef<
	HTMLDivElement,
	{
		value?: Date | null;
		onChange: (val?: Date | null) => void;
		disabledAfter?: Date;
		children?: React.ReactNode;
		side?: "top" | "bottom";
		sideOffset?: number;
		placeholder?: string;
		errors?: (string | undefined)[];
	}
>(function DatePickerCmp(
	{
		children,
		sideOffset,
		disabledAfter,
		placeholder,
		side,
		value: date,
		onChange: setDate,
		errors,
	},
	ref,
) {
	const [open, setOpen] = useState(false);

	const hasErrors = errors && errors.length > 0;
	return (
		<div>
			<p className="text-sm mb-0.5 text-muted-foreground">{placeholder}</p>
			<Popover open={open} onOpenChange={setOpen} modal={true}>
				<PopoverTrigger asChild>
					{children ? (
						children
					) : (
						<Button
							type="button"
							variant="input"
							className={cn(
								"w-full justify-between text-base font-medium text-left font-normal hover:border-primary hover:text-muted-foreground",
								!date && "text-[#94A3B8]",
							)}
							onClick={() => setOpen(true)}
						>
							{date ? (
								format(date, "dd.MM.yyyy", {
									locale: ru,
								})
							) : (
								<span>{placeholder}</span>
							)}
							<CalendarIcon className="mr-2 h-4 w-4" />
						</Button>
					)}
				</PopoverTrigger>
				<PopoverContent
					sideOffset={sideOffset}
					side={side}
					className="w-auto p-0"
					ref={ref}
				>
					<Calendar
						locale={ru}
						mode="single"
						fixedWeeks
						captionLayout="dropdown"
						selected={date ?? undefined}
						onSelect={(d) => setDate(d)}
						disabled={
							disabledAfter
								? {
										after: disabledAfter,
									}
								: undefined
						}
					/>
				</PopoverContent>
			</Popover>
			<div
				className={cn(
					"flex flex-col gap-1 transition-all duration-300",
					hasErrors
						? "opacity-100 translate-y-0 blur-none mt-2"
						: "opacity-0 -translate-y-6 blur-sm",
				)}
			>
				{errors?.filter(Boolean).map((error) => (
					<p className="text-destructive text-sm" key={error}>
						{error}
					</p>
				))}
			</div>
		</div>
	);
});
