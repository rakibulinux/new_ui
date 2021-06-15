// tslint:disable-next-line: no-unnecessary-callback-wrapper
import classnames from 'classnames';
import * as React from 'react';

interface PaginationComponentComponent {
	/**
	 * Number shows first element index in pagination
	 */
	firstElemIndex: number;
	/**
	 * Number shows last element index in pagination
	 */
	lastElemIndex: number;
	/**
	 * Previous page click handler
	 */
	onClickPrevPage: () => void;
	/**
	 * Next page click handler
	 */
	onClickNextPage: () => void;
	/**
	 * Go page click handler
	 */
	onClickToPage: (value: number) => void;
	/**
	 * Number shows current page index
	 */
	page: number;
	/**
	 * Number shows total amount of elements
	 */
	total?: number;
	/**
	 * Separator between first and last values
	 */
	separator?: string;
	/**
	 * Text before total value
	 */
	totalText?: string;
}

/**
 * Pagination component helper for tables
 */
const PaginationComponent: React.FC<PaginationComponentComponent> = props => {
	const { page, lastElemIndex, firstElemIndex } = props;

	const prevDisabled = page === firstElemIndex;
	const nextDisabled = page === lastElemIndex;

	const onClickPrevPage = () => {
		if (prevDisabled) {
			return;
		}
		props.onClickPrevPage();
	};

	const onClickNextPage = () => {
		if (nextDisabled) {
			return;
		}
		props.onClickNextPage();
	};

	return (
		<nav className="cr-mobile-table__pagination" aria-label="Page navigation example">
			<ul className="pagination">
				<li className={classnames('page-item', { disabled: prevDisabled })} onClick={onClickPrevPage}>
					<button className="page-link" aria-label="Previous">
						<span aria-hidden="true">«</span>
						<span className="sr-only">Previous</span>
					</button>
				</li>
				<li className="page-item active">
					<button className="page-link">{page}</button>
				</li>
				<li className={classnames('page-item', { disabled: nextDisabled })} onClick={onClickNextPage}>
					<button className="page-link" aria-label="Next">
						<span aria-hidden="true">»</span>
						<span className="sr-only">Next</span>
					</button>
				</li>
			</ul>
		</nav>
	);
};

export const PaginationMobile = React.memo(PaginationComponent);
