import classnames from 'classnames';
import { useCurrenciesFetch } from 'hooks';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectStakingList, stakingListFetch } from '../../../../modules';
import { StakingList } from '../../containers';

export const StakingListScreen = () => {
	// state
	const [filterStackingState, setFilterStackingState] = React.useState<'upcoming' | 'running' | 'ended' | 'all'>('all');
	const upcomingButtonClassName = classnames(
		'stack-tab-btn',
		filterStackingState === 'upcoming' ? 'stack-tab-btn__upcoming' : '',
	);
	const runningButtonClassName = classnames('stack-tab-btn', filterStackingState === 'running' ? 'stack-tab-btn__running' : '');
	const allButtonClassName = classnames('stack-tab-btn', filterStackingState === 'all' ? 'stack-tab-btn__all' : '');
	const endedButtonClassName = classnames('stack-tab-btn', filterStackingState === 'ended' ? 'stack-tab-btn__ended' : '');

	// store
	const staking_list = useSelector(selectStakingList);
	console.log(staking_list);

	const upcoming_list = staking_list.filter(staking => staking.status === 'upcoming');
	const running_list = staking_list.filter(staking => staking.status === 'running');
	const ended_list = staking_list.filter(staking => staking.status === 'ended');

	// dispatch
	const dispatch = useDispatch();
	const dispatchFetchStakingList = () => dispatch(stakingListFetch());

	useCurrenciesFetch();

	React.useEffect(() => {
		dispatchFetchStakingList();
	}, []);

	const renderStakingList = () => {
		return filterStackingState === 'upcoming' ? (
			<StakingList staking_list={[...upcoming_list]} />
		) : filterStackingState === 'running' ? (
			<StakingList staking_list={[...running_list]} />
		) : filterStackingState === 'ended' ? (
			<StakingList staking_list={[...ended_list]} />
		) : (
			<StakingList staking_list={[...running_list, ...upcoming_list, ...ended_list]} />
		);
	};

	return (
		<div id="staking-list-screen">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<h1>Stake</h1>
					</div>
				</div>
				<div className="staking-buttons">
					<button onClick={() => setFilterStackingState('all')} className={allButtonClassName}>
						All
					</button>
					<button onClick={() => setFilterStackingState('upcoming')} className={upcomingButtonClassName}>
						Upcoming
					</button>
					<button onClick={() => setFilterStackingState('running')} className={runningButtonClassName}>
						Running
					</button>
					<button onClick={() => setFilterStackingState('ended')} className={endedButtonClassName}>
						Ended
					</button>
				</div>

				<div style={{ position: 'relative' }} className="row mt-5">
					{renderStakingList()}
				</div>
			</div>
		</div>
	);
};
