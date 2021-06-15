import { selectVoteListInfoRound } from 'modules';
import moment from 'moment';
import * as React from 'react';
import Countdown, { CountdownRendererFn } from 'react-countdown';
import isEqual from 'react-fast-compare';
import { useSelector } from 'react-redux';

// tslint:disable-next-line: no-empty-interface
interface CountDownVoteProps {}

const CountDownVoteCpn: React.FC<CountDownVoteProps> = ({}) => {
	const infoRound = useSelector(selectVoteListInfoRound, isEqual);
	const diffNum = infoRound ? moment(infoRound.ended_at).diff(moment(infoRound.current_time)) : 0;

	const rendererCountDown: CountdownRendererFn = ({ days, hours, minutes, seconds, completed }) => {
		if (completed) {
			return <div className="pg-vote__cpn__countdown__done text-center">Waiting for the next round!</div>;
		} else {
			return (
				<React.Fragment>
					<div className="pg-vote__cpn__countdown__time-remaining text-center">
						Days left {days}
						<br />
						Time : {hours}:{minutes}:{seconds}
					</div>
				</React.Fragment>
			);
		}
	};

	return (
		<div className="pg-vote__cpn__countdown d-flex">
			<div className="pg-vote--border pg-vote__cpn__countdown__count">
				<Countdown date={Date.now() + diffNum} renderer={rendererCountDown} />
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
