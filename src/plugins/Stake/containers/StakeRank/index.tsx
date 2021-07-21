import React from 'react';
import Countdown from 'react-countdown';

export const StakeRank = () => {
	const renderer = ({ days, hours, minutes, seconds, completed }) => {
		if (completed) {
			// render a completed state
			// window.location.reload(false);
			return (
				<div className="desktop-stake-rank__countdown">
					<div className="desktop-stake-rank__countdown__item">{0}</div>
					<div className="desktop-stake-rank__countdown__item">{0}</div>
					<div className="desktop-stake-rank__countdown__item">{0}</div>
					<div className="desktop-stake-rank__countdown__item">{0}</div>
				</div>
			);
		} else {
			// render a countdown
			return (
				<div className="desktop-stake-rank__countdown">
					<div className="desktop-stake-rank__countdown__item">
						<div>{days}</div>
						<div className="desktop-stake-rank__countdown__item__sub">Days</div>
					</div>
					<div className="desktop-stake-rank__countdown__item">
						<div>{hours}</div>
						<div className="desktop-stake-rank__countdown__item__sub">Hours</div>
					</div>
					<div className="desktop-stake-rank__countdown__item">
						<div>{minutes}</div>
						<div className="desktop-stake-rank__countdown__item__sub">Minutes</div>
					</div>
					<div className="desktop-stake-rank__countdown__item">
						<div>{seconds}</div>
						<div className="desktop-stake-rank__countdown__item__sub">Seconds</div>
					</div>
				</div>
			);
		}
	};
	return (
		<div className="desktop-stake-rank">
			<div className="container">
				<div className="row">
					<div className="col-6 text-center">
						<img width="150px" src="https://www.cx.finance/static/media/1st-v2.68936042.png" alt="top1" />
						<h4 className="mt-3">ID123456789</h4>
					</div>
					<div className="col-6 text-center py-5">
						<h4 className="text-uppercase">
							<strong>Next Ranks Update After:</strong>
						</h4>
						<Countdown date={new Date('2021-07-21 00:00:00')} renderer={renderer} />
					</div>
				</div>
			</div>
		</div>
	);
};
