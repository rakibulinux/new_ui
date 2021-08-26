import { useCurrenciesFetch } from 'hooks';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectStakingList, selectStakingListLoading, stakingListFetch } from 'modules';
import { StakingList } from '../../containers';
import { WrapperTabPage } from 'mobile/components';
import { LoadingSpinner } from 'mobile/plugins';

const PAGE_SIZE = 4;
export const StakingListMobileScreen = () => {
	// state
	const [filterStackingState, setFilterStackingState] = React.useState<'upcoming' | 'running' | 'all'>('all');
	const [pageIndex, setPageIndex] = React.useState(1);
	const [searchState, setSearchState] = React.useState('');
	// dispatch
	const dispatch = useDispatch();
	const dispatchFetchStakingList = () => dispatch(stakingListFetch());

	useCurrenciesFetch();

	React.useEffect(() => {
		setPageIndex(1);
	}, [filterStackingState]);

	React.useEffect(() => {
		dispatchFetchStakingList();
	}, []);

	React.useEffect(() => {
		filterStackingState !== 'all' && setFilterStackingState('all');
	}, [searchState]);

	// store
	const stakingList = useSelector(selectStakingList);
	const isLoadingStakingList = useSelector(selectStakingListLoading);

	const filterList = (() => {
		let result = stakingList;
		switch (filterStackingState) {
			case 'running':
				result = stakingList.filter(staking => staking.status === 'running');
				break;
			case 'upcoming':
				result = stakingList.filter(staking => staking.status === 'upcoming');
				break;
			default:
				result = stakingList;
				break;
		}

		if (searchState) {
			result = result.filter(stake => stake.currency_id.toLowerCase().includes(searchState.toLowerCase()));
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
		<div id="staking-list-mobile-screen">
			<WrapperTabPage
				title={'Stake'}
				filterState={filterStackingState}
				setFilterState={setFilterStackingState}
				searchState={searchState}
				setSearchState={setSearchState}
				totalItem={filterList.length}
				pageIndex={pageIndex}
				pageSize={PAGE_SIZE}
				onPageChange={pageIndexParam => {
					setPageIndex(pageIndexParam);
				}}
			>
				{filterList.length || isLoadingStakingList ? (
					isLoadingStakingList ? (
						<div hidden={!isLoadingStakingList} style={{ marginTop: '200px' }}>
							<LoadingSpinner loading={isLoadingStakingList} />
						</div>
					) : (
						<StakingList staking_list={paginationFilter()} />
					)
				) : undefined}
			</WrapperTabPage>
		</div>
	);
};
