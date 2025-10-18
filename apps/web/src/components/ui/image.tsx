"use client";

import { ImageOff, Loader } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const baseClassName =
	"aspect-square flex items-center justify-center text-muted-foreground rounded-md" as const;

export interface ImageProps {
	src: string;
	className?: string;
	imageClassName?: string;
}

export default function Image({ src, className, ...props }: ImageProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);

	return (
		<>
			{error ? (
				<div className={cn("flex items-center justify-center", className)}>
					<ImageOff className="size-[20%] animate-pulse" />
				</div>
			) : (
				<div
					className={cn(
						"relative inline-block bg-red-400 w-20 h-20",
						className,
					)}
				>
					{isLoading && (
						<div className="absolute inset-0 flex items-center justify-center bg-secondary rounded-xl">
							<Loader className="max-w-1/2 animate-spin" />
						</div>
					)}
					<img
						{...props}
						src={`/api/file/${src}`}
						alt="Загруженное изображение"
						className={cn("max-h-80 h-auto w-auto rounded-xl object-cover")}
						onLoad={() => setIsLoading(false)}
						onError={() => {
							setError(true);
							setIsLoading(false);
						}}
					/>
				</div>
			)}
		</>
	);
}
