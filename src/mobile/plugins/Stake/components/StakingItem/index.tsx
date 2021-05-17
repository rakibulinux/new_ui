import * as React from 'react';
import { useHistory } from 'react-router';
import { selectCurrencies, Stake } from '../../../../../modules';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Countdown from 'react-countdown';
import { useIntl } from 'react-intl';

type Props = Stake;

export const StakingItem: React.FC<Props> = (props: Props) => {
	const intl = useIntl();
	const { staking_id, currency_id, staking_name, rewards, active, status, start_time, end_time } = props;
	const history = useHistory();
	const currencies = useSelector(selectCurrencies);
	const handleGoStacking = () => {
		const location = {
			pathname: '/stake/detail/' + staking_id,
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
					End in: <Countdown date={new Date(end_time)} renderer={renderer} />
				</span>
			</div>
		);
	};

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
					{days}:{hours}:{minutes}:{seconds}
				</span>
			);
		}
	};

	return (
		<div id="stacking-item-mobile">
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
					<div className="reward-container flex-spacer">
						{rewards.map((reward, index) => (
							<div className="reward-box" key={index}>
								<div className="reward-box__rate">{Number(reward.annual_rate) * 100}%</div>
								<div className="reward-box__period text-white">{Number(reward.period)} days</div>
							</div>
						))}
					</div>
					<div className="flex-spacer"></div>
					{renderProgressBar()}
				</section>
				<section className="buttons d-flex flex-row justify-content-between align-items-end">
					<button onClick={handleGoStacking} className="go-stack-btn">
						{intl.formatMessage({ id: `stake.list.item.button.goStake` })}
					</button>
					<button className="learn-more-btn">{intl.formatMessage({ id: `stake.list.item.button.learnMore` })}</button>
				</section>
			</div>
			<div hidden={active} className="stacking-item__disabled">
				<span>Stake is disabled</span>
			</div>
			{renderStakeLabel()}
		</div>
	);
};
