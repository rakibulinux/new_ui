import * as React from 'react';
import { MyAssets, RegisterStake, StakeHistory, StakingInfo, UnStake } from '../../containers';
import Tabs, { TabPane } from 'rc-tabs';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectStakingList,
	selectUserInfo,
	Stake,
	stakeHistoryFetch,
	stakeWalletFetch,
	stakingListFetch,
} from '../../../../../modules';
import { useIntl } from 'react-intl';

const initialStakingItem: Stake = {
	staking_id: '',
	currency_id: '',
	staking_name: '',
	icon_url: '',
	description: '',
	start_time: '',
	end_time: '',
	active: true,
	rewards: [],
	status: '',
};

export const StakingDetailMobileScreen = () => {
	const intl = useIntl();
	const user = useSelector(selectUserInfo);

	// dispatch
	const dispatch = useDispatch();
	const dispatchFetchStakingList = () => dispatch(stakingListFetch());
	const [stakingItemState, setStakingItemState] = React.useState<Stake>(initialStakingItem);
	const { staking_id } = useParams<{ staking_id: string }>();
	const staking_list = useSelector(selectStakingList);

	React.useEffect(() => {
		const staking_item =
			staking_list.find(staking => staking.staking_id.toString() === staking_id.toString()) || initialStakingItem;
		setStakingItemState(staking_item);
	}, [staking_id, staking_list]);

	React.useEffect(() => {
		dispatchFetchStakingList();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		dispatch(stakeWalletFetch({ uid: user.uid }));
		dispatch(stakeHistoryFetch({ uid: user.uid }));
	}, [user.uid]);

	return (
		<div id="staking-detail-mobile-screen">
			<div className="container pt-3">
				<div className="row">
					<div className="col-12">
						<h3>{stakingItemState.currency_id.toUpperCase()} Stake</h3>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<StakingInfo
							currency_id={stakingItemState.currency_id}
							staking_name={stakingItemState.staking_name}
							logo_image={stakingItemState.icon_url}
							description={stakingItemState.description}
						/>
					</div>
				</div>
				<div className="row mt-5">
					<div className="col-12">
						<ul className="staking-notes">
							<li>{intl.formatMessage({ id: `stake.detail.info.stakingNotes1` })}</li>
							<li>{intl.formatMessage({ id: `stake.detail.info.stakingNotes2` })}</li>
							<li>{intl.formatMessage({ id: `stake.detail.info.stakingNotes3` })}</li>
						</ul>
						<hr />
						<h3>{intl.formatMessage({ id: `stake.detail.title.myAssets` })}</h3>
						<MyAssets currency_id={stakingItemState.currency_id} />
					</div>
				</div>
				<div className="row mt-5">
					<div className="col-12">
						<div className="react-tabs">
							<Tabs defaultActiveKey="stake">
								<TabPane tab="STAKE" key="stake">
									<RegisterStake
										currency_id={stakingItemState.currency_id}
										start_time={stakingItemState.start_time}
										end_time={stakingItemState.end_time}
										rewards={stakingItemState.rewards}
										status={stakingItemState.status}
										active={stakingItemState.active}
									/>
								</TabPane>
								<TabPane tab="UNSTAKE" key="unstake">
									<UnStake currency_id={stakingItemState.currency_id} />
								</TabPane>
							</Tabs>
						</div>
					</div>
				</div>
				<hr />
				<div className="row">
					<div className="col-12">
						<h3>{intl.formatMessage({ id: `stake.detail.title.stakeHistory` })}</h3>
						<StakeHistory currency_id={stakingItemState.currency_id} />
					</div>
				</div>
			</div>
		</div>
	);
};
