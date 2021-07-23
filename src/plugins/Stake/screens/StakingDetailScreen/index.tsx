import { useCurrenciesFetch } from 'hooks';
import millify from 'millify';
import Tabs, { TabPane } from 'rc-tabs';
import * as React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import {
	selectStakingList,
	selectUserInfo,
	selectUserLoggedIn,
	Stake,
	stakeHistoryFetch,
	stakeWalletFetch,
	stakingListFetch,
	unStakeHistoryFetch,
} from '../../../../modules';
import { MyAssets, RegisterStake, StakeHistory, StakingInfo, UnStake, UnStakeHistory } from '../../containers';

const initialStakingItem: Stake = {
	stake_id: '',
	currency_id: '',
	staking_name: '',
	description: '',
	start_time: '',
	end_time: '',
	active: true,
	rewards: [],
	status: '',
	ref_link: '',
	total_amount: '0',
	cap_amount: '0',
	cap_amount_per_user: '0',
	min_amount: '0',
};

export const StakingDetailScreen = () => {
	const intl = useIntl();
	const user = useSelector(selectUserInfo);

	useCurrenciesFetch();

	// dispatch
	const dispatch = useDispatch();
	const dispatchFetchStakingList = () => dispatch(stakingListFetch());
	const [stakingItemState, setStakingItemState] = React.useState<Stake>(initialStakingItem);
	const [progressState, setProgressState] = React.useState('');
	const [totalAmountState, setTotalAmountState] = React.useState('');
	const [totalCapState, setTotalCapState] = React.useState('');

	const { stake_id } = useParams<{ stake_id: string }>();
	const stakingList = useSelector(selectStakingList);

	const isLogin = useSelector(selectUserLoggedIn);

	React.useEffect(() => {
		const stakingItem =
			stakingList.find(staking => staking.stake_id.toString() === stake_id.toString()) || initialStakingItem;
		setStakingItemState(stakingItem);
	}, [stake_id, stakingList]);

	React.useEffect(() => {
		if (stakingItemState.rewards.length) {
			const totalAmount: number = Number(stakingItemState.total_amount);
			const totalCap: number = Number(stakingItemState.cap_amount);
			const percent = ((totalCap / totalAmount) * 100).toFixed(2);
			setProgressState(percent);

			setTotalAmountState(
				Number(totalAmount) > 100000000
					? String(
							millify(Number(totalAmount), {
								precision: 2,
							}),
					  )
					: String(totalAmount),
			);
			setTotalCapState(
				Number(totalCap) > 100000000
					? String(
							millify(Number(totalCap), {
								precision: 2,
							}),
					  )
					: String(totalCap),
			);
		}
	}, [stakingItemState]);

	React.useEffect(() => {
		dispatchFetchStakingList();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);

	React.useEffect(() => {
		dispatch(stakeWalletFetch({ uid: user.uid }));
		dispatch(stakeHistoryFetch({ uid: user.uid, stake_id: stake_id }));
		dispatch(unStakeHistoryFetch({ uid: user.uid, currency_id: stakingItemState.currency_id }));
	}, [user.uid, dispatch, stakingItemState.currency_id, stake_id]);

	return (
		<div className="desktop-staking-detail-screen">
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
							description={stakingItemState.description}
							ref_link={stakingItemState.ref_link}
						/>
					</div>
				</div>
				<div className="row mt-5">
					<div className="col-6">
						<div style={{ position: 'relative' }}>
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
								{totalCapState} <span hidden={Number(totalAmountState) <= 0}>/{totalAmountState}</span>
							</span>
						</div>
						<hr />
						<ul className="desktop-staking-detail-screen__notes">
							<li>{intl.formatMessage({ id: `stake.detail.info.stakingNotes1` })}</li>
							<li>{intl.formatMessage({ id: `stake.detail.info.stakingNotes2` })}</li>
							<li>{intl.formatMessage({ id: `stake.detail.info.stakingNotes3` })}</li>
						</ul>
						<hr />
						<h3>{intl.formatMessage({ id: `stake.detail.title.myAssets` })}</h3>
						<MyAssets currency_id={stakingItemState.currency_id} />
					</div>
					<div className="col-6">
						<div className="desktop-staking-detail-screen__react-tabs">
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
										total_amount={stakingItemState.total_amount}
										cap_amount={stakingItemState.cap_amount}
										cap_amount_per_user={stakingItemState.cap_amount_per_user}
										min_amount={stakingItemState.min_amount}
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
			<div className="desktop-staking-detail-screen-disabled" hidden={isLogin}>
				<span>Please login before</span>
			</div>
		</div>
	);
};
