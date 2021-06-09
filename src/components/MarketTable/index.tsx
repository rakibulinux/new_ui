import * as React from 'react';
import { usePagination, useTable } from 'react-table';

interface MarketTableProps {
	columns: any;
	data: any;
}

export const MarketTable: React.FC<MarketTableProps> = (props: MarketTableProps) => {
	const { columns, data } = props;

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page, // instead of using 'rows', we'll use page,

		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		//setPageSize,
		state: { pageIndex },
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0, pageSize: 10 },
			autoResetPage: false,
		},
		usePagination,
	);

	return (
		<div id="market-table">
			<div className="market-table__table">
				<table {...getTableProps()} style={{ position: 'relative' }}>
					<thead>
						{headerGroups.map(headerGroup => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<th width={`${[...columns].length / 100}%`} {...column.getHeaderProps()}>
										<span style={{ fontWeight: 'normal' }}>{column.render('Header')}</span>
									</th>
								))}
							</tr>
						))}
					</thead>
					{
						<tbody {...getTableBodyProps()}>
							{page.map(row => {
								prepareRow(row);

								return (
									<tr {...row.getRowProps()}>
										{row.cells.map(cell => {
											return (
												<td width={`${[...columns].length / 100}%`} {...cell.getCellProps()}>
													{cell.render('Cell')}
												</td>
											);
										})}
									</tr>
								);
							})}
						</tbody>
					}
				</table>
			</div>
			<div className="market-table__pagination">
				<button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
					{'<<'}
				</button>{' '}
				<button onClick={previousPage} disabled={!canPreviousPage}>
					{'<'}
				</button>{' '}
				<span>
					Page{' '}
					<strong className="d-flex justify-center: center">
						<div className="mr-1 ml-1" style={{ color: '#ced4da' }}>
							{+pageIndex + 1}
						</div>{' '}
						of {pageOptions.length}
					</strong>{' '}
				</span>
				<button onClick={nextPage} disabled={!canNextPage}>
					{'>'}
				</button>{' '}
				<button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
					{'>>'}
				</button>{' '}
			</div>
		</div>
	);
};
