import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";

export default function Search({
	search,
	setSearch,
}: {
	search: string;
	setSearch: (search: string) => void;
}) {
	return (
		<Input
			prefix={<SearchIcon className="size-5 text-muted-foreground" />}
			placeholder="Поиск"
			value={search}
			hideLabel
			className="h-10"
			onChange={(e) => setSearch(e.target.value)}
		/>
	);
}
