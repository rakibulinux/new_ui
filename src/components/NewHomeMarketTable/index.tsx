import * as React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

interface MarketTableProps {
	data: any;
}
const TableStyles = styled.div`
	table {
		width: 100%;
		border-spacing: 0;
		th,
		td {
			margin: 0;
			cursor: pointer;
			font-size: 14px;
			color: #C4C4C4;
			text-align: justify;
			padding-top: 15px;
			padding-bottom: 15px;
			padding-right: 10px;
			padding-left: 10px;
			transition: all 0.2s;
		}
		tr {
			border-top: 0.5px solid var(--header-background-color);
		}
		th {
			font-weight: 500;
			font-size: 15px;
			line-height: 20px;
			color: #C4C4C4;
			background-color: #363B4B;
		}
		th:not(:first-child){
			text-align: center;
		}
		th:first-child {
			padding-left: 50px;
			border-top-left-radius: 5px;
		}
		th:last-child {
			padding-right: 50px;
			border-top-right-radius: 5px;
		}
		tr td:not(:first-child) {
			text-align: center;
		}
		tr:hover td {
			background-color: #1E2334;
			color: #fff;
		}
	}
`;

const SLICE_FROM = 0;
const SLICE_TO = 16;

export const NewHomeMarketTable: React.FC<MarketTableProps> = (props: MarketTableProps) => {

	const { data } = props;
	const intl = useIntl();

	return (
		<React.Fragment>
			<TableStyles>
				<table>
					<thead>
						<tr>
							<th scope="col">{intl.formatMessage({ id: 'page.body.marketsTable.header.pair' })}</th>
							<th scope="col">{intl.formatMessage({ id: 'page.body.marketsTable.header.lastPrice' })}</th>
							<th scope="col">{intl.formatMessage({ id: 'page.body.marketsTable.header.change' })}</th>
							<th scope="col">{intl.formatMessage({ id: 'page.body.marketsTable.header.high' })}</th>
							<th scope="col">{intl.formatMessage({ id: 'page.body.marketsTable.header.low' })}</th>
							<th scope="col">{intl.formatMessage({ id: 'page.body.marketsTable.header.volume' })}</th>
							<th scope="col"></th>
						</tr>
					</thead>
					<tbody>
						{data
							.slice(SLICE_FROM, SLICE_TO)
							.map(item => {
								return (
									<tr>
										<td>{item.name}</td>
										<td>{item.last}</td>
										<td>{item.change}</td>
										<td>{item.high}</td>
										<td>{item.low}</td>
										<td>{item.volume}</td>
										<td>{item.trade}</td>
									</tr>
								);
							})}
					</tbody>
				</table>

			</TableStyles>
		</React.Fragment>
	);
};
