import styled from 'styled-components';

interface OrderBookProps {
	tabState: 'all' | 'buy' | 'sell';
}

const OrderBookStyleVar = {
	headHeight: '32px',
	tbHeadHeight: '30px',
	tickerHeight: '30px',
};

export const OrderBookStyle = styled.div<OrderBookProps>`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	height: calc(100% - 6px);
	color: white;
	padding: 0 20px;
	.td-order-book {
		background-color: #313445;
		height: 100%;
		padding-top: 10px;
		padding-bottom: 15px;
		&-item__negative {
			color: var(--header-negative-text-color);
		}
		&-item__positive {
			color: var(--header-positive-text-color);
		}
		&-tooltip {
			bottom: 200px;
		}
		&-header {
			height: ${OrderBookStyleVar.headHeight};
			svg {
				cursor: pointer;
			}
		}
		&-tbheader {
			height: ${OrderBookStyleVar.tbHeadHeight};
			padding-top: 6px;
			padding-bottom: 6px;
			color: #848e9c;
			> div:last-child {
				padding-right: 23px !important;
			}
		}
		&-ticker {
			height: ${OrderBookStyleVar.tickerHeight};
			margin: 5px 23px !important;
			font-size: 14px;
			&__last-price {
				font-size: 20px;
			}
		}
		&-table {
			height: ${(props: OrderBookProps) =>
				props.tabState === 'all'
					? `calc(
				(
						100% - ${OrderBookStyleVar.headHeight} - ${OrderBookStyleVar.tickerHeight} -
							${OrderBookStyleVar.tbHeadHeight} - 15px
					) / 2
			)`
					: `calc(100% - ${OrderBookStyleVar.headHeight} - ${OrderBookStyleVar.tickerHeight} - ${OrderBookStyleVar.tbHeadHeight})`};
			display: block;
			thead,
			tbody {
				display: block;
				tr {
					display: block;
					background-color: transparent;
					cursor: pointer;
					:hover {
						background-color: #4e5463;
					}
					td,
					th {
						width: calc(100% / 3 - 11.5px);
						display: inline-block;
						text-align: right;
						:first-child {
							text-align: left;
						}
						:last-child {
							width: calc(100% / 3 + 23px);
						}
					}
				}
			}
			tbody {
				height: 100%;
				overflow-y: scroll;
				tr {
					margin-top: 1px;
					margin-bottom: 1px;
					td {
						height: 100%;
						&:last-child {
							padding-right: 23px;
						}
					}
				}
			}
			&.td-reverse-table-body {
				tbody {
					transform: rotate(180deg);
					.td-order-book-table__empty_data {
						transform: rotate(180deg);
					}
					tr {
						direction: rtl;
						td {
							transform: rotate(180deg);
						}
					}
				}
			}
		}
	}
`;

interface TrProps {
	percentWidth: number;
	placement: 'left' | 'right';
	color: string;
}

export const TrStyle = styled.tr<TrProps>`
	position: relative;
	z-index: 5;
	&:after {
		content: '';
		position: absolute;
		top: 0;
		right: ${(props: TrProps) => (props.placement === 'right' ? 0 : 'unset')};
		bottom: 0;
		left: ${(props: TrProps) => (props.placement === 'left' ? 0 : 'unset')};
		background-color: ${(props: TrProps) => props.color};
		width: ${(props: TrProps) => props.percentWidth}%;
		z-index: -5;
	}
`;
