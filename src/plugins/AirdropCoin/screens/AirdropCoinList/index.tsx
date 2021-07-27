import message from 'antd/lib/message';
import { localeDate } from 'helpers';
import { useAirdropCoinClaimFetch, useAirdropCoinFetch } from 'hooks';
import get from 'lodash/get';
import { airdropCoinClaimItemActive, selectUserLoggedIn } from 'modules';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
		const hasClaim = get(claim, 'claim_doned') === 0; //is claim exist
		const isDisableClaim = !hasClaim || !userLoggedIn;
		const claimSuccess = !hasClaim && !get(claim, 'msg_status'); //claim success
		const claimFail = !hasClaim && get(claim, 'msg_status'); //claim fail

		let noteStr = '';
		if (claim) {
			const baseMsg = 'Status : ';
			if (claimSuccess) {
				noteStr = `${baseMsg} Distribution will take place on ${localeDate(claim.created_at, 'fullDate')}`;
			} else if (claimFail) {
				noteStr = `${baseMsg} ${claim.msg_status_msg_claim?.msg_note}`;
			}
		}

		return (
			<div className="pg-airdrop-list-coin__list__item" key={i}>
				<div className="pg-airdrop-list-coin__list__item__left">
					<div className="pg-airdrop-list-coin__list__item__title">{item.airdrop_title}</div>
					{noteStr && <div className="pg-airdrop-list-coin__list__item__desc">{noteStr}</div>}
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
