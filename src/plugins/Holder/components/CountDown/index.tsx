import * as React from 'react';
import Countdown, { CountdownRendererFn } from 'react-countdown';
import isEqual from 'react-fast-compare';

const rendererCountDown: CountdownRendererFn = ({ days, hours, minutes, seconds, completed }) => {
	const format = (value: number) => (value.toString().length === 1 ? `0${value}` : value.toString());
	const timeElm = (
		<div className="pg-holder__cpn__countdown__time-remaining text-center">
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
				<div className="pg-holder__cpn__countdown__done text-center">
					The holder list has been closed. Thank you for your participation!
				</div>
				{timeElm}
			</React.Fragment>
		);
	} else {
		return timeElm;
	}
};

const HolderCountDown = () => {
	return (
		<div className="pg-holder__cpn__countdown">
			<div className="pg-holder--border pg-holder__cpn__countdown__count">
				<div className="pg-holder__cpn__countdown__done text-center mb-3">Let's deposit and Holding!</div>
				<Countdown intervalDelay={1000} date={new Date('2021-09-10 00:00:00')} renderer={rendererCountDown} />
			</div>
		</div>
	);
};

export const CountDownHolder = React.memo(HolderCountDown, isEqual);
