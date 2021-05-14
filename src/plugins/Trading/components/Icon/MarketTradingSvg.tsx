import * as React from 'react';

interface MarketTradingSvgProps {
	active?: boolean;
	onHandleHover?: (isHover: boolean) => void;
}

type Props = React.SVGProps<SVGSVGElement> & MarketTradingSvgProps;

export const MarketTradingSvg: React.FC<Props> = ({ active, onHandleHover, ...props }) => {
	const svgRef = React.useRef<SVGSVGElement | null>(null);

	React.useEffect(() => {
		if (svgRef.current && onHandleHover) {
			svgRef.current.addEventListener(
				'mouseenter',
				() => {
					onHandleHover(true);
				},
				false,
			);
			svgRef.current.addEventListener(
				'mouseleave',
				() => {
					onHandleHover(false);
				},
				false,
			);
		}
	}, []);

	return (
		<svg
			ref={ref => (svgRef.current = ref)}
			width="12"
			height="13"
			viewBox="0 0 12 13"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M5.83331 10.0999L9.4383 12.4104L8.48164 8.0557L11.6666 5.12574L7.47247 4.74788L5.83331 0.640991L4.19415 4.74788L0 5.12574L3.18499 8.0557L2.22833 12.4104L5.83331 10.0999Z"
				fill={active ? '#54B489' : '#848E9C'}
			/>
		</svg>
	);
};
