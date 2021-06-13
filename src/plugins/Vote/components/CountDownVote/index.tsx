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
	const diffNum = moment(infoRound.startDay).add(infoRound.roundEndDate, 'days').diff(moment(infoRound.currentTime));

	const rendererCountDown: CountdownRendererFn = ({ days, hours, minutes, seconds, completed }) => {
		if (completed) {
			return <div className="pg-vote__cpn__countdown__done text-center">Waiting for the next round!</div>;
		} else {
			return (
				<React.Fragment>
					<div className="pg-vote__cpn__countdown__time-remaining text-center">
						Days left {days} Time {hours}:{minutes}:{seconds}
					</div>
					{infoRound.lastWin && (
						<div className="pg-vote__cpn__countdown__last-win text-center">
							Last WIN :{' '}
							<span className="pg-vote__cpn__countdown__last-win__winner text-success">
								{infoRound.lastWin.toUpperCase()}
							</span>
						</div>
					)}
				</React.Fragment>
			);
		}
	};

	return (
		<div className="pg-vote__cpn__countdown d-flex justify-content-center align-items-center">
			<div className="pg-vote--border pg-vote__cpn__countdown__wrapper">
				<Countdown date={Date.now() + (infoRound.currentTime ? diffNum : 0)} renderer={rendererCountDown} />
			</div>
		</div>
	);
};

export const CountDownVote = React.memo(CountDownVoteCpn, isEqual);
