import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
		React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	className?: string;
	inputClassName?: string;
	prefix?: React.ReactNode;
	postfix?: React.ReactNode;
	errors?: (string | undefined)[];
	size?: "default" | "textarea";
	hideLabel?: boolean;
}

const Input = React.forwardRef<
	HTMLInputElement | HTMLTextAreaElement,
	InputProps
>(
	(
		{
			className,
			inputClassName: customInputClassName,
			errors,
			size = "default",
			prefix,
			postfix,
			type,
			hideLabel,
			...props
		},
		ref,
	) => {
		const hasErrors = errors && errors.length > 0;

		const inputClassName = cn(
			"flex transition-all h-full duration-300 w-full placeholder:text-zinc-500 text-base resize-none px-3 file:border-0 file:bg-transparent file:text-foreground focus-visible:ring-0 focus-visible:outline-hidden focus-visible:ring-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
			prefix ? "pl-10" : "",
			postfix ? "pr-8" : "",
			size === "textarea" ? "h-[calc(100%-44px)] py-2 min-h-[120px]" : "",
			customInputClassName,
		);

		return (
			<div className={cn("flex flex-col", className)}>
				{!hideLabel && <Label>{props.placeholder}</Label>}

				<div
					className={cn(
						"relative rounded-md border h-11 transition-all duration-300 bg-secondary",
						hasErrors
							? "border-destructive/80 hover:border-destructive"
							: "border-border hover:border-primary",
						size === "textarea" ? "h-fit min-h-[120px]" : "",
					)}
				>
					{prefix && (
						<div className="absolute px-3 inset-y-0 flex items-center justify-center left-0">
							{prefix}
						</div>
					)}
					{postfix && (
						<div className="absolute px-3 h-10 flex items-center justify-center right-0">
							{postfix}
						</div>
					)}
					{size === "default" ? (
						<input
							type={type}
							className={cn("h-full peer", inputClassName)}
							ref={ref as React.Ref<HTMLInputElement>}
							{...props}
						/>
					) : (
						<textarea
							className={cn("peer", inputClassName)}
							ref={ref as React.Ref<HTMLTextAreaElement>}
							{...props}
						/>
					)}
				</div>
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
	},
);
Input.displayName = "Input";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, ...props }, ref) => {
		const [visible, setVisible] = React.useState(false);

		return (
			<div className="h-fit relative flex">
				<Input
					autoComplete="current-password"
					type={visible ? "text" : "password"}
					className="pr-12"
					ref={ref}
					{...props}
				/>
				<Button
					tabIndex={-1}
					size="icon"
					type="button"
					variant="transparent"
					onClick={() => setVisible(!visible)}
					className="absolute h-12 right-0 inset-y-0 text-muted-foreground"
				>
					{visible ? (
						<EyeOffIcon className="size-8" />
					) : (
						<EyeIcon className="size-8" />
					)}
				</Button>
			</div>
		);
	},
);
PasswordInput.displayName = "PasswordInput";

export { Input, PasswordInput };
