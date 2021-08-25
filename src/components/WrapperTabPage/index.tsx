import classnames from 'classnames';
import * as React from 'react';
import Pagination from 'react-bootstrap/Pagination';

// tslint:disable-next-line: no-empty-interface
interface WrapperTabPageProps {
	title: string;

	filterState: 'upcoming' | 'running' | 'all' | 'ended';
	setFilterState: React.Dispatch<React.SetStateAction<'upcoming' | 'running' | 'all' | 'ended'>>;

	searchState: string;
	setSearchState: React.Dispatch<React.SetStateAction<string>>;

	pageSize?: number;
	totalItem: number;
	pageIndex: number;
	onPageChange: (pageIndex: number) => void;
}

export const WrapperTabPage: React.FC<WrapperTabPageProps> = props => {
	const {
		title,
		filterState,
		setFilterState,
		searchState,
		setSearchState,
		pageSize = 6,
		totalItem,
		pageIndex,
		onPageChange,
	} = props;

	React.useEffect(() => {
		setFilterState('all');
	}, [searchState]);

	const renderHeader = () => {
		const upcomingButtonClassName = classnames(
			'td-cpn-wrapper-tab-page__header__buttons-btn',
			filterState === 'upcoming' ? 'td-cpn-wrapper-tab-page__header__buttons__upcoming' : '',
		);
		const runningButtonClassName = classnames(
			'td-cpn-wrapper-tab-page__header__buttons-btn',
			filterState === 'running' ? 'td-cpn-wrapper-tab-page__header__buttons__running' : '',
		);
		const endedButtonClassName = classnames(
			'td-cpn-wrapper-tab-page__header__buttons-btn',
			filterState === 'ended' ? 'td-cpn-wrapper-tab-page__header__buttons__ended' : '',
		);
		const allButtonClassName = classnames(
			'td-cpn-wrapper-tab-page__header__buttons-btn',
			filterState === 'all' ? 'td-cpn-wrapper-tab-page__header__buttons__all' : '',
		);

		return (
			<div className="container td-cpn-wrapper-tab-page__header">
				<div className="row">
					<div className="col-12">
						<h3 className="td-cpn-wrapper-tab-page__header__h3">{title}</h3>
					</div>
				</div>
				<div className="d-flex flex-row justify-content-between">
					<div className="td-cpn-wrapper-tab-page__header__search">
						<input
							placeholder="Search currency"
							type="text"
							value={searchState}
							onChange={e => setSearchState(e.target.value)}
						/>
						<div className="icon-search">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
									fill="#848E9C"
								/>
							</svg>
						</div>
					</div>
					<div className="td-cpn-wrapper-tab-page__header__buttons">
						<button onClick={() => setFilterState('all')} className={allButtonClassName}>
							All <span hidden={filterState !== 'all'}></span>
						</button>
						<button onClick={() => setFilterState('upcoming')} className={upcomingButtonClassName}>
							Upcoming <span hidden={filterState !== 'upcoming'}></span>
						</button>
						<button onClick={() => setFilterState('running')} className={runningButtonClassName}>
							Running <span hidden={filterState !== 'running'}></span>
						</button>
						<button onClick={() => setFilterState('ended')} className={endedButtonClassName}>
							Ended <span hidden={filterState !== 'ended'}></span>
						</button>
					</div>
				</div>
			</div>
		);
	};

	const renderPagination = () => {
		return (
			<Pagination className="d-flex justify-content-end" style={{ padding: '10px' }}>
				<Pagination.Prev
					disabled={pageIndex - 1 <= 0}
					id={pageIndex - 1 <= 0 ? 'non-active' : 'active'}
					onClick={() => {
						onPageChange(pageIndex - 1);
					}}
				/>
				<Pagination.Item id={'active'}>{pageIndex}</Pagination.Item>
				<Pagination.Next
					disabled={pageIndex * pageSize >= totalItem}
					id={pageIndex * pageSize >= totalItem ? 'non-active' : 'active'}
					onClick={() => {
						onPageChange(pageIndex + 1);
					}}
				/>
			</Pagination>
		);
	};

	return (
		<div className="td-cpn-wrapper-tab-page">
			{renderHeader()}
			<div
				style={{ position: 'relative', paddingRight: '0px', paddingLeft: '0px' }}
				className="m-auto container td-cpn-wrapper-tab-page__body"
			>
				<div style={{ paddingLeft: '1em', paddingRight: '1em' }}>
					{props.children ? (
						<React.Fragment>
							{props.children}
							{renderPagination()}
						</React.Fragment>
					) : (
						<React.Fragment>
							<div className="w-100 text-center">
								<img
									src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
									alt="no-data"
								/>
							</div>
							<div className="w-100 text-center mt-2">
								<h5>No Data</h5>
							</div>
						</React.Fragment>
					)}
				</div>
			</div>
		</div>
	);
};
