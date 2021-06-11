import * as React from 'react';

// tslint:disable-next-line: no-empty-interface
interface NewPaginationProps {
	page?: number;
	total?: number;
	toPage: (pageIndex: number) => void;
}

export const NewPagination: React.FC<NewPaginationProps> = ({ page = 1, total = 1, toPage }) => {
	return (
		<div className="td-cpn-pagination">
			<button onClick={() => toPage(1)} disabled={page === 1}>
				{'<<'}
			</button>{' '}
			<button onClick={() => toPage(page - 1)} disabled={page === 1}>
				{'<'}
			</button>{' '}
			<span>
				Page{' '}
				<strong className="d-flex justify-center: center">
					<div className="mr-1 ml-1" style={{ color: '#ced4da' }}>
						{page}
					</div>{' '}
					of {total}
				</strong>{' '}
			</span>
			<button onClick={() => toPage(page + 1)} disabled={page === total}>
				{'>'}
			</button>{' '}
			<button onClick={() => toPage(total)} disabled={page === total}>
				{'>>'}
			</button>{' '}
		</div>
	);
};
