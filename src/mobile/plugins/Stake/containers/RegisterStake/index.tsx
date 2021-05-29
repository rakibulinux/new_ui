import classNames from 'classnames';
import * as React from 'react';
import {
	createStake,
	selectCreateStakeLoading,
	selectStakeHistoriesLoading,
	selectUserInfo,
	selectWallets,
	stakeHistoryFetch,
	stakingListFetch,
	StakingReward,
} from '../../../../../modules';
import { format, addDays } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { getTimeZone } from '../../../../../helpers';
import Countdown from 'react-countdown';
import { LoadingSpinner } from '../../components';
import { useIntl } from 'react-intl';

interface RegisterStakeProps {
	stake_id: string;
	currency_id: string;
	start_time: string;
	end_time: string;
	rewards: StakingReward[];
	status: 'upcoming' | 'running' | 'ended' | '';
	active: boolean;
}

const DEFAULT_PERIOD_INDEX = 0;

export const RegisterStake: React.FC<RegisterStakeProps> = (props: RegisterStakeProps) => {
	const intl = useIntl();
	const { stake_id, currency_id, rewards, start_time, status, active } = props;
	const [selectedPeriodIndexState, setSelectedPeriodIndexState] = React.useState<number>(DEFAULT_PERIOD_INDEX);
	const [lockupDateState, setLockupDateState] = React.useState('');
	const [releaseDateState, setReleaseDateState] = React.useState('');
	const [expectedRewardState, setExpectedRewardState] = React.useState('');
	const [amountState, setAmountState] = React.useState('');
	const [agreeState, setAgreeState] = React.useState(false);
	const [rewardState, setRewardState] = React.useState({
		reward_id: '',
		period: 0,
		total_amount: '0',
		cap_amount: '0',
		min_amount: '0',
		cap_amount_per_user: '0',
		annual_rate: 0,
		payment_time: '',
	});

	const isLoadingCreateStake = useSelector(selectCreateStakeLoading);
	const isLoadingStakingList = useSelector(selectStakeHistoriesLoading);

	const wallets = useSelector(selectWallets);
	const wallet = wallets.find(wallet => wallet.currency.toLowerCase() === currency_id.toLowerCase()) || { balance: 0.0 };

	const selecterdPeriodButtonClass = classNames('period-btn', 'period-btn__active');

	React.useEffect(() => {
		setExpectedRewardState(((rewardState.annual_rate / 365) * rewardState.period * Number(amountState)).toString());
	}, [amountState, selectedPeriodIndexState, rewardState]);

	const handleSelectLockupPeriod = React.useCallback(
		(period_index: number) => {
			const reward = rewards[period_index];
			setSelectedPeriodIndexState(period_index);

			if (reward) {
				const { reward_id, period, annual_rate, min_amount, total_amount, cap_amount, payment_time } = reward;
				setLockupDateState(format(new Date(), 'yyyy-MM-dd hh:mm'));
				setReleaseDateState(format(addDays(new Date(), Number(period)), 'yyyy-MM-dd hh:mm'));
				setRewardState({
					...rewardState,
					reward_id: String(reward_id),
					period: Number(period),
					min_amount: min_amount,
					cap_amount: cap_amount,
					total_amount: total_amount,
					annual_rate: Number(annual_rate),
					payment_time: payment_time !== '' ? format(new Date(payment_time), 'yyyy-MM-dd hh:mm') : '',
				});
			}
		},
		[rewardState, rewards],
	);

	React.useEffect(() => {
		if (rewards.length > 0) {
			const validRewardIndex = rewards.findIndex(reward => Number(reward.total_amount) > Number(reward.cap_amount));
			setSelectedPeriodIndexState(validRewardIndex ? validRewardIndex : DEFAULT_PERIOD_INDEX);
			handleSelectLockupPeriod(validRewardIndex ? validRewardIndex : DEFAULT_PERIOD_INDEX);
		}
	}, [rewards]);

	const isDisableStakeButton =
		Number(amountState) < Number(rewardState.min_amount) ||
		!agreeState ||
		Number(amountState) > Number(wallet.balance) ||
		Number(expectedRewardState) <= 0;

	const renderer = ({ days, hours, minutes, seconds, completed }) => {
		if (completed) {
			// Render a completed state
			// window.location.reload(false);
			return (
				<span>
					{0}:{0}:{0}:{0}
				</span>
			);
		} else {
			// Render a countdown
			return (
				<span>
					{days}d {hours}h {minutes}m {seconds}s
				</span>
			);
		}
	};

	const renderProgress = () => {
		return (
			<span className="text-warning" hidden={status !== 'upcoming'}>
				{intl.formatMessage({ id: `stake.detail.register.startIn` })}:{' '}
				<Countdown date={new Date(start_time)} renderer={renderer} />
			</span>
		);
	};

	const dispatch = useDispatch();
	const user = useSelector(selectUserInfo);

	const resetForm = () => {
		setAmountState('');
		setAgreeState(false);
		handleSelectLockupPeriod(DEFAULT_PERIOD_INDEX);
	};

	const handleCreateStake = () => {
		resetForm();
		dispatch(
			createStake({
				uid: user.uid,
				reward_id: rewardState.reward_id,
				amount: amountState,
				lockup_date: lockupDateState,
				release_date: releaseDateState,
			}),
		);
		dispatch(stakeHistoryFetch({ uid: user.uid, stake_id: stake_id }));
		dispatch(stakingListFetch());
	};

	const stakeButtonClassNames = classNames('stake-btn', isDisableStakeButton ? 'stake-btn--disabled' : '');

	return (
		<div id="register-mobile-stake">
			<div className="container">
				<div className="row">
					<div className="col-12 text-right">
						<span className="amount-number">
							{intl.formatMessage({ id: `stake.detail.register.availableAmount` })}: {wallet.balance}{' '}
							{currency_id.toUpperCase()}
						</span>
					</div>
					<div className="col-12 text-right">
						<div className="amount-box">
							<span>{intl.formatMessage({ id: `stake.detail.register.amount` })}</span>
							<input
								value={amountState}
								type="number"
								placeholder="0"
								onChange={e => {
									const amount = e.target.value;
									if (Number(amount) >= 0) setAmountState(amount);
								}}
							/>
							<span>{currency_id.toUpperCase()}</span>
						</div>
					</div>
					<div className="col-12">
						<span
							hidden={Number(amountState) >= Number(rewardState.min_amount) || amountState === ''}
							className="text-danger float-right"
						>
							No less than{' '}
							<strong>
								{Number(rewardState.min_amount)} {currency_id.toUpperCase()}
							</strong>{' '}
							can be staked at a time.
						</span>
					</div>
				</div>
				<div className="row mt-3">
					<div className="col-12">
						<h5 className="stake-register-section-title">
							{intl.formatMessage({ id: `stake.detail.register.lockupPeriod` })}
						</h5>
						<div className="d-flex flex-row justify-content-between">
							{rewards.map((reward: StakingReward, index: number) => (
								<button
									disabled={Number(reward.total_amount) <= Number(reward.cap_amount)}
									key={index}
									className={selectedPeriodIndexState === index ? selecterdPeriodButtonClass : 'period-btn'}
									onClick={() => handleSelectLockupPeriod(index)}
								>
									{Number(reward.period)} days
								</button>
							))}
						</div>
					</div>
					<div className="col-12">
						<span className="float-right annual-reward-number">
							Annualized Rewards <strong>{Number(rewardState.annual_rate) * 100}%</strong>
						</span>
					</div>
				</div>
				<div className="row mt-3">
					<div className="col-12">
						<h5 className="stake-register-section-title">
							{intl.formatMessage({ id: `stake.detail.register.lockupDates` })} (GMT{getTimeZone()})
						</h5>
					</div>
					<div className="col-12">
						<div className="staking-details">
							<div className="detail-row">
								<span className="key"> {intl.formatMessage({ id: `stake.detail.register.lockup` })}</span>
								<span className="value">{lockupDateState}</span>
							</div>
							<div className="detail-row">
								<span className="key"> {intl.formatMessage({ id: `stake.detail.register.release` })}</span>
								<span className="value">{releaseDateState}</span>
							</div>
							<div className="detail-row">
								<span className="key"> {intl.formatMessage({ id: `stake.detail.register.paymentTime` })}</span>
								<span className="value">{rewardState.payment_time}</span>
							</div>
						</div>
					</div>
				</div>
				<div className="row mt-3">
					<div className="col-12">
						<h5 className="stake-register-section-title">
							{' '}
							{intl.formatMessage({ id: `stake.detail.register.expectedRewards` })}
						</h5>
					</div>
					<div className="col-12">
						<div className="expected-reward-box">
							<span></span>
							<input type="text" disabled value={expectedRewardState} />
							<span>{currency_id.toUpperCase()}</span>
						</div>
					</div>
				</div>
				<div className="row mt-3">
					<div className="col-12">
						<label className="agree">
							<input type="checkbox" onChange={e => setAgreeState(e.target.checked)} />
							{intl.formatMessage({ id: `stake.detail.register.agreeCautions` })}
						</label>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<button
							onClick={() => handleCreateStake()}
							className={stakeButtonClassNames}
							disabled={isDisableStakeButton}
						>
							STAKE
						</button>
					</div>
				</div>
				<LoadingSpinner loading={isLoadingStakingList || isLoadingCreateStake} />
				<div className="stacking-register__disabled text-info" hidden={status === 'running'}>
					<span>{renderProgress()}</span>
				</div>
				<div className="stacking-register__disabled text-info" hidden={active}>
					<span>{intl.formatMessage({ id: `stake.detail.register.stakeDisabled` })}</span>
				</div>
				<div className="stacking-register__disabled text-info" hidden={status !== 'ended'}>
					<span>{intl.formatMessage({ id: `stake.detail.register.stakeEnded` })}</span>
				</div>
			</div>
		</div>
	);
};
