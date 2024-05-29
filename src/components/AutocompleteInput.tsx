// adapted from https://hackernoon.com/autocomplete-search-component-with-react-and-typescript
import { useEffect, useRef, useState } from 'react';

interface Props {
	names: string[];
	id: string;
	name: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
	required: boolean;
}

const AutocompleteInput = ({
	names,
	id,
	name,
	placeholder,
	value,
	onChange,
	required,
}: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [activeSuggestion, setActiveSuggestion] = useState(0);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;
		onChange(inputValue);
		if (inputValue !== '') {
			setSuggestions(names);
		} else {
			setSuggestions([]);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (
			event.key === 'ArrowDown' &&
			activeSuggestion < suggestions.length - 1
		) {
			setActiveSuggestion(activeSuggestion + 1);
		} else if (event.key === 'ArrowUp' && activeSuggestion > 0) {
			setActiveSuggestion(activeSuggestion - 1);
		} else if (event.key === 'Enter' && suggestions.length > 0) {
			const selectedValue = suggestions[activeSuggestion];
			onChange(selectedValue);
			setSuggestions([]);
			setActiveSuggestion(0);
		}
	};

	const handleClick = (value: string) => {
		onChange(value);
		setSuggestions([]);
		setActiveSuggestion(0);
	};

	return (
		<div className="relative">
			<input
				type="text"
				name={name}
				id={id}
				className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
				placeholder={placeholder}
				value={value}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				ref={inputRef}
				required={required}
			/>

			{suggestions.length > 0 && (
				<div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg z-10">
					{suggestions.map((name, index) => (
						<div
							key={index}
							className={`p-2 cursor-pointer ${
								index === activeSuggestion
									? 'bg-blue-300'
									: 'bg-white'
							}`}
							onClick={() => handleClick(name)}
						>
							{name}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AutocompleteInput;
