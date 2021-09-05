import * as React from 'react';
import { useSelector } from 'react-redux';

import './CompetitionInfo.css';

import { Button, Cascader, Statistic } from 'antd';
import { format } from 'date-fns';
import Countdown from 'react-countdown';

import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader';
import { useHistory } from 'react-router';
import { selectCompetitionItem } from '../../../../../modules';

const renderer = ({ days, hours, minutes, seconds, completed }) => {
	if (completed) {
		// render a completed state
		return (
			<div className="ant-statistic-content">
				<div className="ant-statistic-content-value">00 : 00</div>
			</div>
		);
	} else {
		// render a countdown
		return (
			<div className="ant-statistic-content">
				<div className="ant-statistic-content-value">
					{minutes < 10 ? 0 : ''}
					{minutes} : {seconds < 10 ? 0 : ''}
					{seconds}
				</div>
			</div>
		);
	}
};

interface CompetitionInfoProps {
	volumn: number;
}

export const CompetitionInfo: React.FC<CompetitionInfoProps> = (props: CompetitionInfoProps) => {
	// props
	const { volumn } = props;

	// state
	const [marketIDState, setMarketIDState] = React.useState('');

	const history = useHistory();
	const competition = useSelector(selectCompetitionItem);
	const { currency_id, market_ids, next_update, start_date, end_date } = competition.payload;

	// options: Dropdown trade
	const options = market_ids
		? market_ids.map(marketId => {
				const newMarketIds = {
					value: marketId.replace('/', ''),
					label: marketId.toUpperCase(),
				};

				return newMarketIds;
		  })
		: [];

	const onChange = (value: CascaderValueType, selectedOptions?: CascaderOptionType[] | undefined) => {
		setMarketIDState(value.toString());
	};

	const handleGoTrading = () => {
		const location = {
			pathname: `/trading/${marketIDState}`,
		};
		history.push(location);
	};

	const renderTopInfo = () => {
		return (
			<React.Fragment>
				<div className="row">
					<div className="col-12 text-center">
						<h2 className="competition-info-mobile__title" style={{ color: '#f07c22' }}>
							Become a winner and get a prize
						</h2>
					</div>
				</div>
				<div className="row">
					<div className="col-12 text-center">
						<h5>
							Trade {currency_id.toUpperCase()} and win. The one who trades the largest volume will receive the main
							prize! Condition: buy or sell {currency_id.toUpperCase()}!
						</h5>
					</div>
				</div>
			</React.Fragment>
		);
	};

	const renderBottomInfo = () => {
		if (next_update && start_date && end_date) {
			return (
				<React.Fragment>
					<div className="row">
						<div className="col-6">
							<Statistic title="Your Trade Volume" value={volumn.toFixed(0)} />
						</div>
						<div className="col-6">
							<h3 className="ant-statistic-title">Next rank update</h3>
							<Countdown date={new Date(next_update)} renderer={renderer} />
						</div>
					</div>
					<div className="row">
						<div className="col-12">
							<Statistic title="Start Time" value={format(new Date(start_date), 'yyyy-MM-dd hh:mm')} />
							<Statistic className="mt-3" title="End Time" value={format(new Date(end_date), 'yyyy-MM-dd hh:mm')} />
						</div>
					</div>
					<div className="row">
						<div className="col-12 text-center mt-3">
							<Cascader
								className="competition-item__bottom-select w-100 text-center"
								allowClear={false}
								options={options}
								onChange={onChange}
								placeholder="Trade"
							/>
							<Button type="primary" className="mt-2" disabled={marketIDState === ''} onClick={handleGoTrading}>
								Let's Trade
							</Button>
						</div>
					</div>
				</React.Fragment>
			);
		}

		return '';
	};

	return (
		<div id="competition-info-mobile" style={{ backgroundColor: '#0E121C', height: '100%' }}>
			{renderTopInfo()}
			<hr />
			{renderBottomInfo()}
		</div>
	);
};
