import * as React from 'react';
import { useTable, usePagination } from 'react-table';
import EmptySVG from './empty.svg';

interface ReacTableProps {
	columns: any;
	data: any;
	headColor: string;
}

export const ReactTable: React.FC<ReacTableProps> = (props: ReacTableProps) => {
	const { columns, data, headColor } = props;
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page, // Instead of using 'rows', we'll use page,
		// which has only the rows for the active page

		// The rest of these things are super handy, too ;)
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize },
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0, pageSize: 20 },
			autoResetPage: false
		},
		usePagination,
	);

	// Render the UI for your table
	return (
		<div id="react-table">
			<table {...getTableProps()} style={{ position: 'relative' }}>
				<thead style={{ backgroundColor: headColor }}>
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th {...column.getHeaderProps()}>
									<span style={{ fontWeight: 'normal' }}>{column.render('Header')}</span>
								</th>
							))}
						</tr>
					))}
				</thead>
				{[...page].length === 0 ? (
					<div className="text-center empty">
						<img className="text-center" width="100px" src={EmptySVG} />
						<br />
						<p>No Data</p>
					</div>
				) : (
					<tbody {...getTableBodyProps()}>
						{page.map(row => {
							prepareRow(row);
							return (
								<tr {...row.getRowProps()}>
									{row.cells.map(cell => {
										return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
									})}
								</tr>
							);
						})}
					</tbody>
				)}
			</table>
			<div className="pagination">
				<div className="pagination-page_number">
					<span>
						Page{' '}
						<strong>
							{pageIndex + 1} of {pageOptions.length}
						</strong>{' '}
					</span>
					<span>
						| Go to page:{' '}
						<input
							type="number"
							defaultValue={pageIndex + 1}
							onChange={e => {
								const page = e.target.value ? Number(e.target.value) - 1 : 0;
								gotoPage(page);
							}}
							style={{ width: '100px' }}
						/>
					</span>{' '}
				</div>
				<div className="pagination-button-box">
					<button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
						{'<<'}
					</button>{' '}
					<button onClick={() => previousPage()} disabled={!canPreviousPage}>
						{'<'}
					</button>{' '}
					<button style={{ backgroundColor: '#8093C4' }}>{pageIndex + 1}</button>{' '}
					<button onClick={() => nextPage()} disabled={!canNextPage}>
						{'>'}
					</button>{' '}
					<button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
						{'>>'}
					</button>{' '}
				</div>
				<div className="pagination-page_select">
					<select
						value={pageSize}
						onChange={e => {
							setPageSize(Number(e.target.value));
						}}
					>
						{[20, 30, 40, 50].map(pageSize => (
							<option key={pageSize} value={pageSize}>
								Show {pageSize}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
};
