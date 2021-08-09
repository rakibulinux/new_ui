import message from 'antd/lib/message';
import { localeDate } from 'helpers';
import { useAirdropCoinClaimFetch, useAirdropCoinFetch } from 'hooks';
import get from 'lodash/get';
import { airdropCoinClaimItemActive, selectUserLoggedIn } from 'modules';
import moment from 'moment';
import * as React from 'react';
import { ProgressBar } from 'react-bootstrap';
import Countdown, { CountdownRendererFn } from 'react-countdown';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const rendererCountDown: CountdownRendererFn = ({ days, hours, minutes, seconds, completed }) => {
	const format = (value: number) => (value.toString().length === 1 ? `0${value}` : value.toString());
	const timeElm = (
		<div className="td-mobile-screen-airdrop-list-coin--color-green">
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

export const AirdropCoinListMobileScreen: React.FC<AirdropCoinListScreenProps> = ({}) => {
	// const intl = useIntl();
	const history = useHistory();
	const dispatch = useDispatch();
	const airdrops = useAirdropCoinFetch();
	const claims = useAirdropCoinClaimFetch();

	const userLoggedIn = useSelector(selectUserLoggedIn);

	const handleClaim = (airdropId: string) => {
		if (userLoggedIn) {
			const hide = message.loading('Loading...', 0);
			dispatch(
				airdropCoinClaimItemActive({ airdropId }, () => {
					hide();
				}),
			);
		} else {
			history.push('/login');
		}
	};

	const airDropsElm = airdrops.map((item, i) => {
		const nowTime = moment.utc();
		const claim = claims.find(claimParam => claimParam.airdrop_id === item.airdrop_id);
		const progressPercent = ((item.total_claim / item.max_claim) * 100).toFixed(2);

		const hasClaim = get(claim, 'claim_doned') === null; //is claim exist
		const comming = moment.utc(item.started_at).isAfter(nowTime);
		const ended = moment.utc(item.ended_at).isBefore(nowTime);
		const maxed = item.total_claim >= item.max_claim;
		const isDisableClaim = !claim || !hasClaim || !userLoggedIn || maxed || ended || comming;
		const claimSuccess = get(claim, 'claim_doned') === 1; //claim success
		const claimFail = get(claim, 'claim_doned') === 0; //claim fail
		const userNameBot = get(item, 'bot.config_bot.tele_username_bot') as string | undefined;
		const linkToBot = userNameBot ? `https://t.me/${userNameBot}` : undefined;

		const baseMsg = 'Status : ';
		let noteStr = `${baseMsg} Click 'Join' to join!`;
		// tslint:disable-next-line: prefer-conditional-expression
		if (comming) {
			noteStr = `${baseMsg} The airdrop hasn't started yet!`;
		} else if (claimSuccess) {
			noteStr = `${baseMsg} Distribution will take place on ${localeDate(item.distribution_at, 'fullDate')}`;
		} else if (claimFail) {
			noteStr = `${baseMsg} ${get(claim, 'msg_status_msg_claim.msg_note', '')}`;
		} else if (ended) {
			noteStr = `${baseMsg} The airdrop has ended. Thank you for your participation!`;
		} else if (maxed) {
			noteStr = `${baseMsg} The maximum number of claims has been reached`;
		} else if (!userLoggedIn) {
			noteStr = noteStr;
		} else if (!isDisableClaim) {
			noteStr = `${baseMsg} Click 'Claim' to receive`;
		}

		return (
			<div className="td-mobile-screen-airdrop-list-coin__list__item" key={i}>
				<div className="td-mobile-screen-airdrop-list-coin__list__item__left">
					<div className="td-mobile-screen-airdrop-list-coin__list__item__title">
						{item.airdrop_id.toUpperCase()} - {item.airdrop_title}
					</div>
					<div className="td-mobile-screen-airdrop-list-coin__list__item__desc">
						<div>
							<Countdown
								intervalDelay={1000}
								date={
									comming || ended
										? Date.now()
										: Date.now() + (moment(item.ended_at).diff(moment(moment().utc())) || 1000)
								}
								renderer={rendererCountDown}
							/>
							<div>{noteStr}</div>
						</div>
					</div>
				</div>
				<div className="td-mobile-screen-airdrop-list-coin__list__item__mid">
					<div className="td-mobile-screen-airdrop-list-coin__list__item__mid__top">
						<div className="td-mobile-screen-airdrop-list-coin__list__item__total">
							<div className="td-mobile-screen-airdrop-list-coin__list__item__total__title">Total Claim</div>
							<div className="td-mobile-screen-airdrop-list-coin__list__item__total__claim">
								<ProgressBar animated now={Number(progressPercent)} />
								<div className="td-mobile-screen-airdrop-list-coin__list__item__total__claim__value td-mobile-screen-airdrop-list-coin--color-green">
									{item.total_claim} / {item.max_claim}
								</div>
							</div>
						</div>
					</div>
					<div className="td-mobile-screen-airdrop-list-coin__list__item__mid__bottom">
						<div className="td-mobile-screen-airdrop-list-coin__list__item__ref">
							<div className="td-mobile-screen-airdrop-list-coin__list__item__ref__title">Gift</div>
							<div className="td-mobile-screen-airdrop-list-coin__list__item__ref__desc td-mobile-screen-airdrop-list-coin--color-red">
								{get(item, 'bot.config_bot.value_of_gift', '')}
							</div>
						</div>
						<div className="td-mobile-screen-airdrop-list-coin__list__item__ref">
							<div className="td-mobile-screen-airdrop-list-coin__list__item__ref__title">Gift Ref</div>
							<div className="td-mobile-screen-airdrop-list-coin__list__item__ref__desc td-mobile-screen-airdrop-list-coin--color-red">
								{get(item, 'bot.config_bot.value_of_gift_ref', '')}
							</div>
						</div>
					</div>
				</div>
				<div className="td-mobile-screen-airdrop-list-coin__list__item__right">
					<a
						className="td-mobile-screen-airdrop-list-coin__list__item__link"
						href={linkToBot}
						target="_blank"
						rel="noopener noreferrer"
					>
						<button
							disabled={!userNameBot || ended || comming}
							className="btn btn-lg btn-block  td-mobile-screen-airdrop-list-coin__list__item__button"
						>
							Join
						</button>
					</a>
					<button
						disabled={isDisableClaim}
						className="btn btn-lg btn-success btn-block td-mobile-screen-airdrop-list-coin__list__item__button"
						onClick={() => handleClaim(item.airdrop_id)}
					>
						Claim
					</button>
				</div>
			</div>
		);
	});

	const renderHeader = () => {
		return (
			<div className="container td-mobile-screen-airdrop-list-coin__header">
				<div className="row">
					<div className="col-12">
						<h3 className="td-mobile-screen-airdrop-list-coin__header__h3">Airdrops</h3>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="td-mobile-screen-airdrop-list-coin">
			{renderHeader()}
			<div className="container td-mobile-screen-airdrop-list-coin__list">
				{airDropsElm.length ? (
					airDropsElm
				) : (
					<div style={{ marginTop: ' 50px', width: '100vw' }}>
						<div className="w-100 text-center">
							<img
								src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
								alt="no-data"
							/>
						</div>
						<div className="w-100 text-center mt-2">
							<h5>No Data</h5>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
