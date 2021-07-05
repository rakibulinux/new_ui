import classnames from 'classnames';
import { selectVoteListInfoRound } from 'modules';
import moment from 'moment';
import * as React from 'react';
import Countdown, { CountdownRendererFn } from 'react-countdown';
import isEqual from 'react-fast-compare';
import { useSelector } from 'react-redux';

const rendererCountDown: CountdownRendererFn = ({ days, hours, minutes, seconds, completed }) => {
	const format = (value: number) => (value.toString().length === 1 ? `0${value}` : value.toString());
	const timeElm = (
		<div className="pg-vote__cpn__countdown__time-remaining text-center">
			<span>
				{format(days)}
				<i>Days</i>
			</span>
			<span>
				{format(hours)}
				<i>Hours</i>
			</span>
			<span>
				{format(minutes)}
				<i>Minutes</i>
			</span>
			<span>
				{format(seconds)} <i>Seconds</i>
			</span>
		</div>
	);
	if (completed) {
		return (
			<React.Fragment>
				<div className="pg-vote__cpn__countdown__done text-center">
					The vote has ended. Thank you for your participation!
				</div>
				{timeElm}
			</React.Fragment>
		);
	} else {
		return timeElm;
	}
};

// tslint:disable-next-line: no-empty-interface
interface CountDownVoteProps {}

const CountDownVoteCpn: React.FC<CountDownVoteProps> = ({}) => {
	const infoRound = useSelector(selectVoteListInfoRound, isEqual);
	const [diffNum, setDiffNum] = React.useState(0);
	React.useEffect(() => {
		setDiffNum(infoRound ? moment(infoRound.ended_at).diff(moment(infoRound.current_time)) : 0);
	}, [infoRound]);

	return (
		<div className="pg-vote__cpn__countdown">
			<div
				className={classnames('pg-vote--border pg-vote__cpn__countdown__count', {
					'mb-3': infoRound && infoRound.coin_id,
				})}
			>
				<Countdown
					intervalDelay={1000}
					date={diffNum ? Date.now() + diffNum : Date.now() + 10000}
					renderer={rendererCountDown}
				/>
			</div>
			{infoRound && infoRound.coin_id && (
				<div className="pg-vote--border pg-vote__cpn__countdown__last-win text-center">
					Last WIN :{' '}
					<span className="pg-vote__cpn__countdown__last-win__winner text-success">
						{infoRound.infoCoin.id.toUpperCase()}
					</span>
					<br />
					Website :{' '}
					<a rel="noopener noreferrer" target="_blank" href={infoRound.infoCoin.website}>
						{infoRound.infoCoin.website}
					</a>
				</div>
			)}
		</div>
	);
};

export const CountDownVote = React.memo(CountDownVoteCpn, isEqual);
