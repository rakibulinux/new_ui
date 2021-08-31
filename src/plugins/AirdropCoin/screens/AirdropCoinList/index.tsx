import message from 'antd/lib/message';
import { WrapperTabPage } from 'components';
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

const PAGE_SIZE = 6;

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
	const [pageIndex, setPageIndex] = React.useState(1);

	React.useEffect(() => {
		setPageIndex(1);
	}, [filterAirdropCoinState]);

	React.useEffect(() => {
		filterAirdropCoinState !== 'all' && setFilterAirdropCoinState('all');
	}, [searchState]);

	const filterList = (() => {
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

		if (searchState) {
			result = result.filter(airdrop => airdrop.airdrop_id.toLowerCase().includes(searchState.toLowerCase()));
		}

		return result;
	})();

	const paginationFilter = () => {
		let result = filterList;
		const startSlice = (pageIndex - 1) * PAGE_SIZE;
		const endSlice = startSlice + PAGE_SIZE;
		result = result.slice(startSlice, endSlice);

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

	const airDropsElm = paginationFilter().map((item, i) => {
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
								{get(item, 'bot.config_bot.value_of_gift', '')}
							</div>
						</div>
						<div className="pg-airdrop-list-coin__list__item__ref">
							<div className="pg-airdrop-list-coin__list__item__ref__title">Gift Ref</div>
							<div className="pg-airdrop-list-coin__list__item__ref__desc pg-airdrop-list-coin--color-red">
								{get(item, 'bot.config_bot.value_of_gift_ref', '')}
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
							Join
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

	return (
		<div className="pg-airdrop-list-coin">
			<WrapperTabPage
				title={'Airdrops'}
				filterState={filterAirdropCoinState}
				setFilterState={setFilterAirdropCoinState}
				searchState={searchState}
				setSearchState={setSearchState}
				totalItem={filterList.length}
				pageIndex={pageIndex}
				pageSize={PAGE_SIZE}
				onPageChange={pageIndexParam => {
					setPageIndex(pageIndexParam);
				}}
			>
				{airDropsElm.length ? airDropsElm : undefined}
			</WrapperTabPage>
		</div>
	);
};
