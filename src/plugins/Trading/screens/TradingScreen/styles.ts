import styled from 'styled-components';

export const TradingScreenStyle = styled.div`
	background: var(--main-background-color);
	font-size: calc(var(--font-size) * 1);
	margin-bottom: 6px;
	display: grid;
	gap: 6px;
	grid-template-columns: 4fr 8fr 4fr;
	grid-template-rows: 70px 520px minmax(min-content, 300px) 350px;
	.td-pg-trading__item {
		position: relative;
	}
	.td-pg-trading--bg {
		background-color: #313445;
	}
	.td-pg-trading__header-toolbar {
		grid-column: 1/3;
	}
	.td-pg-trading__market-trading {
		grid-column: 3/4;
		grid-row: 1/3;
	}
	.td-pg-trading__order-book {
		grid-column: 1/2;
		grid-row: 2/4;
	}
	.td-pg-trading__trading-chart {
		grid-column: 2/3;
		grid-row: 2/3;
		.pg-trading-chart {
			height: 100%;
		}
	}
	.td-pg-trading__order {
		grid-column: 2/3;
		grid-row: 3/4;
	}
	.td-pg-trading__recent-trade {
		grid-column: 3/4;
		grid-row: 3/4;
	}
	.td-pg-trading__order-history {
		grid-column: 1/4;
		grid-row: 4/5;
	}
	.row {
		margin: 0;
	}
`;
