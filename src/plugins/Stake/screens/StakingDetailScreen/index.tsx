import * as React from 'react';
import { MyAssets, RegisterStake, StakeHistory, StakingInfo, UnStake, UnStakeHistory } from '../../containers';
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
	unStakeHistoryFetch,
} from '../../../../modules';
import { useIntl } from 'react-intl';
import { ProgressBar } from 'react-bootstrap';

const initialStakingItem: Stake = {
	stake_id: '',
	currency_id: '',
	staking_name: '',
	icon_url: '',
	description: '',
	start_time: '',
	end_time: '',
	active: true,
	rewards: [],
	status: '',
	ref_link: '',
};

export const StakingDetailScreen = () => {
	const intl = useIntl();
	const user = useSelector(selectUserInfo);

	// dispatch
	const dispatch = useDispatch();
	const dispatchFetchStakingList = () => dispatch(stakingListFetch());
	const [stakingItemState, setStakingItemState] = React.useState<Stake>(initialStakingItem);
	const [progressState, setProgressState] = React.useState('');
	const [totalAmountState, setTotalAmountState] = React.useState('');
	const [totalCapState, setTotalCapState] = React.useState('');

	const { stake_id } = useParams<{ stake_id: string }>();
	const stakingList = useSelector(selectStakingList);

	React.useEffect(() => {
		const staking_item =
			stakingList.find(staking => staking.stake_id.toString() === stake_id.toString()) || initialStakingItem;
		setStakingItemState(staking_item);
	}, [stake_id, stakingList]);

	React.useEffect(() => {
		if (stakingItemState.rewards.length) {
			const totalAmount: number = stakingItemState.rewards
				.map(reward => Number(reward.total_amount))
				.reduce((a, b) => a + b, 0);
			const totalCap: number = stakingItemState.rewards.map(reward => Number(reward.cap_amount)).reduce((a, b) => a + b, 0);
			const percent = ((totalCap / totalAmount) * 100).toFixed(2);
			setProgressState(percent);
			setTotalAmountState(totalAmount.toFixed(5));
			setTotalCapState(totalCap.toFixed(5));
		}
	}, [stakingItemState]);

	React.useEffect(() => {
		dispatchFetchStakingList();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);

	React.useEffect(() => {
		dispatch(stakeWalletFetch({ uid: user.uid, currency_id: stakingItemState.currency_id }));
		dispatch(stakeHistoryFetch({ uid: user.uid, stake_id: stake_id }));
		dispatch(unStakeHistoryFetch({ uid: user.uid, currency_id: stakingItemState.currency_id }));
	}, [user.uid, dispatch, stakingItemState.currency_id, stake_id]);

	return (
		<div id="staking-detail-screen">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<h1>{stakingItemState.currency_id.toUpperCase()} Stake</h1>
					</div>
				</div>
				<div className="row mt-5">
					<div className="col-12">
						<StakingInfo
							currency_id={stakingItemState.currency_id}
							staking_name={stakingItemState.staking_name}
							logo_image={stakingItemState.icon_url}
							description={stakingItemState.description}
							ref_link={stakingItemState.ref_link}
						/>
					</div>
				</div>
				<div className="row mt-5">
					<div className="col-6">
						<div style={{ position: 'relative' }} hidden={Number(totalAmountState) <= 0}>
							<ProgressBar
								style={{ height: '75px', background: 'rgba(132, 142, 156, 0.35)', fontSize: '30px' }}
								animated
								now={Number(progressState)}
							/>
							<span
								className="text-white"
								style={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									fontSize: '2rem',
								}}
							>
								{totalCapState}/{totalAmountState}
							</span>
						</div>
						<hr />
						<ul className="staking-notes">
							<li>{intl.formatMessage({ id: `stake.detail.info.stakingNotes1` })}</li>
							<li>{intl.formatMessage({ id: `stake.detail.info.stakingNotes2` })}</li>
							<li>{intl.formatMessage({ id: `stake.detail.info.stakingNotes3` })}</li>
						</ul>
						<hr />
						<h3>{intl.formatMessage({ id: `stake.detail.title.myAssets` })}</h3>
						<MyAssets currency_id={stakingItemState.currency_id} />
					</div>
					<div className="col-6">
						<div className="react-tabs">
							<Tabs defaultActiveKey="stake">
								<TabPane tab="STAKE" key="stake">
									<RegisterStake
										stake_id={stake_id}
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
					<div className="col-7">
						<h2 className="text-warning">{intl.formatMessage({ id: `stake.detail.title.stakeHistory` })}</h2>
						<StakeHistory currency_id={stakingItemState.currency_id} />
					</div>
					<div className="col-5">
						<h2 className="text-warning">{intl.formatMessage({ id: `stake.detail.title.unStakeHistory` })}</h2>
						<UnStakeHistory currency_id={stakingItemState.currency_id} />
					</div>
				</div>
			</div>
		</div>
	);
};
