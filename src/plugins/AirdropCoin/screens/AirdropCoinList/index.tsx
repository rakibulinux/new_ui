import message from 'antd/lib/message';
import classnames from 'classnames';
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
		<div className="pg-airdrop-list-coin--color-green">
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
	const history = useHistory();
	const dispatch = useDispatch();
	const airdrops = useAirdropCoinFetch();
	const claims = useAirdropCoinClaimFetch();

	const userLoggedIn = useSelector(selectUserLoggedIn);

	const [filterAirdropCoinState, setFilterAirdropCoinState] = React.useState<'upcoming' | 'running' | 'all' | 'ended'>(
		'running',
	);
	const [searchState, setSearchState] = React.useState('');

	React.useEffect(() => {
		filterAirdropCoinState !== 'all' && setFilterAirdropCoinState('all');
	}, [searchState]);

	const filterList = () => {
		let result = airdrops;
		const nowTime = moment.utc();
		switch (filterAirdropCoinState) {
			case 'ended':
				result = airdrops.filter(airdrop => moment.utc(airdrop.ended_at).isBefore(nowTime));
				break;
			case 'running':
				result = airdrops.filter(
					airdrop => moment.utc(airdrop.started_at).isBefore(nowTime) && moment.utc(airdrop.ended_at).isAfter(nowTime),
				);
				break;
			case 'upcoming':
				result = airdrops.filter(airdrop => moment.utc(airdrop.started_at).isAfter(nowTime));
				break;
			default:
				result = airdrops;
				break;
		}

		return result;
	};

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

	const airDropsElm = filterList().map((item, i) => {
		const nowTime = moment.utc();
		const claim = claims.find(claimParam => claimParam.airdrop_id === item.airdrop_id);
		const progressPercent = ((item.total_claim / item.max_claim) * 100).toFixed(2);
		// tslint:disable-next-line: prefer-template
		const giftValue = `${(get(item, 'bot.config_bot.value_of_gift', '0 CX') as string).split('CX')[0].trim()} CX`;
		const giftValueRef = `${(get(item, 'bot.config_bot.value_of_gift_ref', '0 CX') as string).split('CX')[0].trim()} CX`;

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
		let noteStr = `${baseMsg} Click 'Select Join' to join!`;
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
			<div className="pg-airdrop-list-coin__list__item" key={i}>
				<div className="pg-airdrop-list-coin__list__item__left">
					<div className="pg-airdrop-list-coin__list__item__title">
						{item.airdrop_id.toUpperCase()} - {item.airdrop_title}
					</div>
					<div className="pg-airdrop-list-coin__list__item__desc">
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
				<div className="pg-airdrop-list-coin__list__item__mid">
					<div className="pg-airdrop-list-coin__list__item__mid__top">
						<div className="pg-airdrop-list-coin__list__item__total">
							<div className="pg-airdrop-list-coin__list__item__total__title">Total Claim</div>
							<div className="pg-airdrop-list-coin__list__item__total__claim">
								<ProgressBar animated now={Number(progressPercent)} />
								<div className="pg-airdrop-list-coin__list__item__total__claim__value pg-airdrop-list-coin--color-green">
									{item.total_claim} / {item.max_claim}
								</div>
							</div>
						</div>
					</div>
					<div className="pg-airdrop-list-coin__list__item__mid__bottom">
						<div className="pg-airdrop-list-coin__list__item__ref">
							<div className="pg-airdrop-list-coin__list__item__ref__title">Gift</div>
							<div className="pg-airdrop-list-coin__list__item__ref__desc pg-airdrop-list-coin--color-red">
								{giftValue}
							</div>
						</div>
						<div className="pg-airdrop-list-coin__list__item__ref">
							<div className="pg-airdrop-list-coin__list__item__ref__title">Gift Ref</div>
							<div className="pg-airdrop-list-coin__list__item__ref__desc pg-airdrop-list-coin--color-red">
								{giftValueRef}
							</div>
						</div>
					</div>
				</div>
				<div className="pg-airdrop-list-coin__list__item__right">
					<a
						className="pg-airdrop-list-coin__list__item__link"
						href={linkToBot}
						target="_blank"
						rel="noopener noreferrer"
					>
						<button
							disabled={!userNameBot || ended || comming}
							className="btn btn-lg btn-block  pg-airdrop-list-coin__list__item__button"
						>
							Select Join
						</button>
					</a>
					<button
						disabled={isDisableClaim}
						className="btn btn-lg btn-success btn-block pg-airdrop-list-coin__list__item__button"
						onClick={() => handleClaim(item.airdrop_id)}
					>
						Claim
					</button>
				</div>
			</div>
		);
	});

	const renderHeader = () => {
		const upcomingButtonClassName = classnames(
			'pg-airdrop-list-coin__header__buttons-btn',
			filterAirdropCoinState === 'upcoming' ? 'pg-airdrop-list-coin__header__buttons__upcoming' : '',
		);
		const runningButtonClassName = classnames(
			'pg-airdrop-list-coin__header__buttons-btn',
			filterAirdropCoinState === 'running' ? 'pg-airdrop-list-coin__header__buttons__running' : '',
		);
		const endedButtonClassName = classnames(
			'pg-airdrop-list-coin__header__buttons-btn',
			filterAirdropCoinState === 'ended' ? 'pg-airdrop-list-coin__header__buttons__ended' : '',
		);
		const allButtonClassName = classnames(
			'pg-airdrop-list-coin__header__buttons-btn',
			filterAirdropCoinState === 'all' ? 'pg-airdrop-list-coin__header__buttons__all' : '',
		);

		return (
			<div className="container pg-airdrop-list-coin__header">
				<div className="row">
					<div className="col-12">
						<h3 className="pg-airdrop-list-coin__header__h3">Airdrops</h3>
					</div>
				</div>
				<div className="d-flex flex-row justify-content-between">
					<div className="pg-airdrop-list-coin__header__search">
						<input
							placeholder="Search currency"
							type="text"
							value={searchState}
							onChange={e => setSearchState(e.target.value)}
						/>
						<div className="icon-search">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
									fill="#848E9C"
								/>
							</svg>
						</div>
					</div>
					<div className="pg-airdrop-list-coin__header__buttons">
						<button onClick={() => setFilterAirdropCoinState('all')} className={allButtonClassName}>
							All <span hidden={filterAirdropCoinState !== 'all'}></span>
						</button>
						<button onClick={() => setFilterAirdropCoinState('upcoming')} className={upcomingButtonClassName}>
							Upcoming <span hidden={filterAirdropCoinState !== 'upcoming'}></span>
						</button>
						<button onClick={() => setFilterAirdropCoinState('running')} className={runningButtonClassName}>
							Running <span hidden={filterAirdropCoinState !== 'running'}></span>
						</button>
						<button onClick={() => setFilterAirdropCoinState('ended')} className={endedButtonClassName}>
							Ended <span hidden={filterAirdropCoinState !== 'ended'}></span>
						</button>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="pg-airdrop-list-coin">
			{renderHeader()}
			<div className="row m-auto container pg-airdrop-list-coin__list">
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
