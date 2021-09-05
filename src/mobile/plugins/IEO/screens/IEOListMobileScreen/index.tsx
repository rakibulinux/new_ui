import { WrapperTabPage } from 'mobile/components';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IEOListDataFetch, selectIEOList } from 'modules';
import { ListItemIEO } from '../../containers';

const PAGE_SIZE = 4;

export type typeIEO = 'all' | 'running' | 'upcoming';
export const IEOListMobileScreen = () => {
	const [typeIEO, setTypeIEO] = React.useState<typeIEO>('all');
	const [searchInputState, setSearchInputState] = React.useState<string>('');
	const [pageIndex, setPageIndex] = React.useState<number>(1);
	const dispatch = useDispatch();
	const listIEO = useSelector(selectIEOList);

	React.useEffect(() => {
		setPageIndex(1);
	}, [typeIEO]);

	React.useEffect(() => {
		typeIEO !== 'all' && setTypeIEO('all');
	}, [searchInputState]);

	React.useEffect(() => {
		dispatch(IEOListDataFetch());
	}, []);

	const filterList = (() => {
		let result = listIEO.payload;
		if (searchInputState) {
			result = result.filter(item => item.currency_id.toLowerCase().includes(searchInputState.toLowerCase().trim()));
		}

		if (typeIEO === 'all') {
			result = result;
		} else {
			result = result.filter(item => item.type === typeIEO);
		}

		return result;
	})();

	const paginationFilter = () => {
		let result = filterList;
		const startSlice = (pageIndex - 1) * PAGE_SIZE;
		const endSlice = startSlice + PAGE_SIZE;
		result = result.slice(startSlice, endSlice);

		return result;
	};

	return (
		<div id="ieo-list-mobile-screen">
			<WrapperTabPage
				title={'IEO'}
				filterState={typeIEO}
				setFilterState={setTypeIEO}
				searchState={searchInputState}
				setSearchState={setSearchInputState}
				totalItem={filterList.length}
				pageIndex={pageIndex}
				pageSize={PAGE_SIZE}
				onPageChange={pageIndexParam => {
					setPageIndex(pageIndexParam);
				}}
			>
				{filterList.length || listIEO.loading ? (
					<div>
						{listIEO.loading ? (
							<div className="loading">
								<div className="spinner-border text-primary" role="status">
									<span className="sr-only">Loading...</span>
								</div>
							</div>
						) : (
							<ListItemIEO IEOList={paginationFilter()} />
						)}
					</div>
				) : undefined}
			</WrapperTabPage>
		</div>
	);
};
