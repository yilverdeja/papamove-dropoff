interface Props {
	index: number;
}

const MarkerIcon = ({ index }: Props) => {
	// returns a marker svg icon with a variable number in it
	return (
		<svg height="40" width="30" viewBox="0 0 30 40">
			<path d="M 15 0 L 27 15 L 15 40 L 3 15 Z" fill="blue" />
			<text
				x="15"
				y="18"
				fill="white"
				fontSize="18"
				fontWeight="bold"
				textAnchor="middle"
				alignmentBaseline="central"
			>
				{index}
			</text>
		</svg>
	);
};

export default MarkerIcon;
