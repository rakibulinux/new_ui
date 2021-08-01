import message from 'antd/lib/message';
import { localeDate } from 'helpers';
import { useAirdropCoinClaimFetch, useAirdropCoinFetch } from 'hooks';
import get from 'lodash/get';
import { airdropCoinClaimItemActive, selectUserLoggedIn } from 'modules';
import moment from 'moment';
import * as React from 'react';
import Countdown, { CountdownRendererFn } from 'react-countdown';
import { useDispatch, useSelector } from 'react-redux';

const rendererCountDown: CountdownRendererFn = ({ days, hours, minutes, seconds, completed }) => {
	const format = (value: number) => (value.toString().length === 1 ? `0${value}` : value.toString());
	const timeElm = (
		<div>
			Remaining : {format(days)}
			Days {format(hours)}:{format(minutes)}:{format(seconds)}
		</div>
	);
	if (completed) {
		return timeElm;
	} else {
		return timeElm;
	}
};

// tslint:disable-next-line: no-empty-interface
interface AirdropCoinListScreenProps {}

export const AirdropCoinListScreen: React.FC<AirdropCoinListScreenProps> = ({}) => {
	// const intl = useIntl();
	const dispatch = useDispatch();
	const airdrops = useAirdropCoinFetch();
	const claims = useAirdropCoinClaimFetch();

	const userLoggedIn = useSelector(selectUserLoggedIn);

	const handleClaim = (airdropId?: number) => {
		if (userLoggedIn && airdropId) {
			const hide = message.loading('Loading...', 0);
			dispatch(
				airdropCoinClaimItemActive({ airdropId }, () => {
					hide();
				}),
			);
		}
	};

	const airDropsElm = airdrops.map((item, i) => {
		// tslint:disable-next-line: no-shadowed-variable
		const claim = claims.find(claim => claim.airdrop_id === item.airdrop_id);
		const hasClaim = !Boolean(get(claim, 'claim_doned')) && !Boolean(get(claim, 'claim_failed')); //is claim exist
		const expired = !moment.utc().isBefore(moment.utc(item.ended_at));
		const maxed = item.total_claim >= item.max_claim;
		const isDisableClaim = !claim || !hasClaim || !userLoggedIn || maxed || expired;
		const claimSuccess = Boolean(get(claim, 'claim_doned')); //claim success
		const claimFail = Boolean(get(claim, 'claim_failed')); //claim fail

		let noteStr = '';
		const baseMsg = 'Status : ';
		// tslint:disable-next-line: prefer-conditional-expression
		if (expired) {
			noteStr = `${baseMsg} The airdrop has ended. Thank you for your participation!`;
		} else if (!isDisableClaim) {
			noteStr = `${baseMsg} Click 'Claim' to receive`;
		} else if (claimSuccess) {
			noteStr = `${baseMsg} Distribution will take place on ${localeDate(item.distribution_at, 'fullDate')}`;
		} else if (claimFail) {
			noteStr = `${baseMsg} ${get(claim, 'msg_status_msg_claim.msg_note', '')}`;
		} else if (maxed) {
			noteStr = `${baseMsg} The maximum number of claims has been reached`;
		} else {
			noteStr = `${baseMsg} Click 'Select Join' to join!`;
		}

		return (
			<div className="pg-airdrop-list-coin__list__item" key={i}>
				<div className="pg-airdrop-list-coin__list__item__left">
					<div className="pg-airdrop-list-coin__list__item__title">{item.airdrop_title}</div>
					<div className="pg-airdrop-list-coin__list__item__desc">
						<div>
							<Countdown
								intervalDelay={1000}
								date={Date.now() + (moment(item.ended_at).diff(moment(moment().utc())) || 1000)}
								renderer={rendererCountDown}
							/>
							<div>
								Total claim : {item.total_claim}/{item.max_claim}
							</div>
							<div>{noteStr}</div>
						</div>
					</div>
				</div>
				<div className="pg-airdrop-list-coin__list__item__right">
					<a
						className="pg-airdrop-list-coin__list__item__link"
						href={item.airdrop_link}
						target="_blank"
						rel="noopener noreferrer"
					>
						<button className="btn btn-lg btn-block  pg-airdrop-list-coin__list__item__button">Select Join</button>
					</a>
					<button
						disabled={isDisableClaim}
						className="btn btn-lg btn-success btn-block pg-airdrop-list-coin__list__item__button"
						onClick={() => handleClaim(get(claim, 'airdrop_id'))}
					>
						Claim
					</button>
				</div>
			</div>
		);
	});

	return (
		<div className="pg-airdrop-list-coin">
			<div className="container">
				<div className="pg-airdrop-list-coin__list">{airDropsElm}</div>
			</div>
		</div>
	);
};
