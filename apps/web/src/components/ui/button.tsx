import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import Loader from "@/components/loader";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center leading-[130%] justify-center gap-2 whitespace-nowrap rounded-md text-base ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 font-medium",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/80",
				destructive: "text-white bg-destructive hover:bg-destructive/80",
				approved: "bg-approved text-white hover:bg-approved/80",
				outline: "border border-border bg-background hover:bg-secondary",
				"outline-destructive":
					"border text-destructive border-destructive bg-background hover:bg-destructive hover:text-destructive-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:border-primary border",
				cancel: "bg-secondary text-slate-900 hover:bg-border border",
				transparent: "bg-transparent border-0 hover:bg-transparent",
				ghost:
					"border border-transparent hover:border-border hover:bg-secondary",
				link: "text-primary underline-offset-4 hover:underline",
				white: "bg-white text-foregroud border border-input hover:bg-white/90",
				input:
					"bg-secondary !h-11 text-sm justify-between border border-input/10 disabled:opacity-30 hover:opacity-80",
			},
			size: {
				default: "h-10 px-3 py-2",
				sm: "px-2.5 py-2 rounded-[6px]",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
				link: "size-fit p-0 m-0",
				input: "h-14 px-2",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			disabled,
			children,
			loading,
			size,
			asChild = false,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={loading || disabled}
				{...props}
			>
				{loading ? <Loader /> : children}
			</Comp>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
