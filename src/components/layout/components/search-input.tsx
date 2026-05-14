import { SearchIcon } from "lucide-react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

interface SearchInputProps {
	className?: string;
}

export const SearchInput = ({ className }: SearchInputProps) => {
	return (
		<InputGroup className={className}>
			<InputGroupInput
				aria-label="Type your search query"
				placeholder="What are you looking for?"
				size="lg"
				type="search"
			/>
			<InputGroupAddon>
				<SearchIcon aria-hidden="true" className="text-muted-foreground" />
			</InputGroupAddon>
		</InputGroup>
	);
};
