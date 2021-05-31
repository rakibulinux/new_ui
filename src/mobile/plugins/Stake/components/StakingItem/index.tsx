import * as React from 'react';
import { useHistory } from 'react-router';
import { selectCurrencies, Stake } from '../../../../../modules';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Countdown from 'react-countdown';
import { useIntl } from 'react-intl';
import { ProgressBar } from 'react-bootstrap';

type Props = Stake;

export const StakingItem: React.FC<Props> = (props: Props) => {
	const intl = useIntl();
	const { stake_id, currency_id, staking_name, rewards, active, status, start_time, end_time, ref_link } = props;
	const [progressState, setProgressState] = React.useState('');
	const [totalAmountState, setTotalAmountState] = React.useState('');
	const [totalCapState, setTotalCapState] = React.useState('');
	const history = useHistory();
	const currencies = useSelector(selectCurrencies);
	const handleGoStacking = () => {
		const location = {
			pathname: '/stake/detail/' + stake_id,
		};
		history.push(location);
	};

	const getCryptoIcon = (currency_id: string): string => {
		const currency = currencies.find((currency: any) => currency.id === currency_id);
		try {
			return require(`../../../../../../node_modules/cryptocurrency-icons/128/color/${currency_id.toLowerCase()}.png`);
		} catch (err) {
			if (currency) return currency.icon_url;
			return require('../../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const statusClassnames = classNames(
		'stacking-item__label',
		status === 'upcoming'
			? 'stacking-item__label-upcoming'
			: status === 'running'
			? 'stacking-item__label-running'
			: status === 'ended'
			? 'stacking-item__label-ended'
			: '',
	);

	const renderStakeLabel = () => {
		return <div className={statusClassnames}>{status.toUpperCase()}</div>;
	};

	const renderProgressBar = () => {
		return (
			<div className="timer" hidden={status === 'ended'}>
				<span className="text-warning" hidden={status !== 'upcoming'}>
					Start in: <Countdown date={new Date(start_time)} renderer={renderer} />
				</span>
				<span className="text-danger" hidden={status !== 'running'}>
					Close in: <Countdown date={new Date(end_time)} renderer={renderer} />
				</span>
			</div>
		);
	};

	React.useEffect(() => {
		const totalAmount: number = rewards.map(reward => Number(reward.total_amount)).reduce((a, b) => a + b, 0);
		const totalCap: number = rewards.map(reward => Number(reward.cap_amount)).reduce((a, b) => a + b, 0);
		const percent = ((totalCap / totalAmount) * 100).toFixed(2);
		setProgressState(percent);
		setTotalAmountState(totalAmount.toFixed(5));
		setTotalCapState(totalCap.toFixed(5));
	}, [rewards]);

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

	return (
		<div id="stacking-item">
			<div className={statusClassnames}>
				<span>{status.toUpperCase()}</span>
			</div>
			<div className="staking-item-container d-flex flex-column">
				<section className="image">
					<div className="logo-image">
						<img src={getCryptoIcon(currency_id)} alt="" />
					</div>
				</section>
				<section className="text">
					<h3 className="title">{staking_name}</h3>
					<div className="reward-container d-flex flex-row flex-wrap align-items-center">
						{rewards.map((reward, index) => (
							<div className="reward">
								<div className="reward-box" key={index}>
									<div className="reward-box__rate">{Number(reward.annual_rate) * 100}%</div>
									<div className="reward-box__period text-white">{Number(reward.period)} days</div>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="stake-item__time d-flex flex-row justify-content-between align-items-end">
					{renderProgressBar()}
				</section>
				<section className="stake-item__progress d-flex flex-row justify-content-between align-items-end">
					<div style={{ position: 'relative', width: '100%' }}>
						<ProgressBar
							style={{ width: '100%', background: 'rgba(132, 142, 156, 0.35)', height: '20px' }}
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
							}}
						>
							{totalCapState}/{totalAmountState}
						</span>
					</div>
				</section>

				<section className="buttons d-flex flex-row justify-content-between align-items-end">
					<button onClick={handleGoStacking} className="go-stack-btn">
						{status === 'ended' || status === 'upcoming'
							? intl.formatMessage({ id: `stake.list.item.button.view` })
							: intl.formatMessage({ id: `stake.list.item.button.goStake` })}
					</button>
					<a rel="noopener noreferrer" target="_blank" href={ref_link} className="btn learn-more-btn">
						{intl.formatMessage({ id: `stake.list.item.button.learnMore` })}
					</a>
				</section>
			</div>
			<div hidden={active} className="stacking-item__disabled">
				<span>Stake is disabled</span>
			</div>
			{renderStakeLabel()}
		</div>
	);
};