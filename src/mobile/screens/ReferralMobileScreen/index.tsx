import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useDocumentTitle } from 'hooks';
import { selectUserLoggedIn } from 'modules';
import { referralRanksFetch, selectReferalRanksList } from 'modules/plugins/referral';
import ReactTooltip from 'react-tooltip';
import { ReferralContent } from '../../containers';
enum RankType {
	Friend = 'friend',
	Commision = 'commision',
}
const ReferralMobileBanner = require('./Assets/referral-mobile-banner.png');
const RankNo1 = require('./Assets/top1.png');
const RankNo2 = require('./Assets/top2.png');
const RankNo3 = require('./Assets/top3.png');
const LoginReferral = require('./Assets/LoginReferral.svg');
const Stick = require('./Assets/stick.svg');

export const ReferralMobileScreen: React.FC = () => {
	useDocumentTitle('Referral');
	const history = useHistory();

	// selectors
	const isLoggedIn = useSelector(selectUserLoggedIn);
	const referralRanks = useSelector(selectReferalRanksList);

	// dispatch
	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(referralRanksFetch());
	}, []);

	const renderBannerReferral = () => {
		return (
			<React.Fragment>
				<div className="td-mobile-pg-referral__banner">
					<img className="img-fluid" src={ReferralMobileBanner} alt="banner" />
				</div>
			</React.Fragment>
		);
	};
	const renderReferralRank = () => {
		const rankBox = (rankIndex: number, uid: string = '', commission: string = '', type = RankType.Friend) => {
			let image;
			switch (rankIndex) {
				case 1:
					image = RankNo1;
					break;
				case 2:
					image = RankNo2;
					break;
				case 3:
					image = RankNo3;
					break;
				default:
					break;
			}

			return (
				<div className="col-lg-4 col-md-12 td-mobile-pg-referral__rank__box mb-3">
					<div className="td-mobile-pg-referral__rank__box__row">
						<div className="col-2 pr-3">
							<img src={image} alt={`no.${rankIndex}`} />
						</div>
						<div className="col-5">
							<div>
								<span className="text-white td-mobile-pg-referral__rank__box__row__commision__coin-name">{`NO.${rankIndex}`}</span>
							</div>
							<div className="mt-3">
								<span data-tip={uid} className="text-white td-pg-referral__rank__box__row__rank__mail">
									{uid}
								</span>
							</div>
						</div>
						<div className="col-5">
							<div className="text-right">
								<span className="text-white">{type === RankType.Friend ? 'Friends' : 'Commision'}</span>
							</div>
							<div className="text-right mt-3">
								<span
									data-tip={commission}
									className="text-white td-mobile-pg-referral__rank__box__row__rank__commision"
								>
									{commission}
								</span>
							</div>
						</div>
					</div>
				</div>
			);
		};

		return (
			<div className="td-mobile-pg-referral__rank">
				<div className="container">
					<div className="row">
						{referralRanks[0]
							? rankBox(1, referralRanks[0].uid, referralRanks[0].total, referralRanks[0].type)
							: rankBox(1)}
						{referralRanks[1]
							? rankBox(2, referralRanks[1].uid, referralRanks[1].total, referralRanks[1].type)
							: rankBox(2)}
						{referralRanks[2]
							? rankBox(3, referralRanks[2].uid, referralRanks[2].total, referralRanks[2].type)
							: rankBox(3)}
					</div>
				</div>
			</div>
		);
	};
	const renderUsersLoggedIn = () => {
		if (isLoggedIn) {
			return <ReferralContent />;
		} else {
			return (
				<div className="td-mobile-pg-referral__loggedIn">
					<div className="container">
						<div
							className="td-mobile-pg-referral__loggedIn__userLogIn"
							style={{
								backgroundImage: `url(${LoginReferral})`,
							}}
						>
							<div className="referral-loggedIn-userLogIn__wrapper">
								<div className="referral-loggedIn-userLogIn__wrapper__desription">
									You are not logged in, please login and share with your friends.
								</div>
								<div className="referral-loggedIn-userLogIn__wrapper__login">
									<button onClick={redirectToLogin}>Login</button>
									<p>
										{' '}
										Not on CX yet?<span onClick={redirectToRegister}>Register</span>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}
	};

	const redirectToLogin = (): void | any => {
		history.push('/login');
	};
	const redirectToRegister = (): void | any => {
		history.push('/signup');
	};
	const renderProgramDetail = () => {
		return (
			<div className="td-mobile-pg-referral__detail">
				<div className="container">
					<h2 className="text-white">Program Details</h2>
					<div className="row mt-3">
						<div className="col-md-6 d-flex justify-content-start align-items-start">
							<img src={Stick} alt="stick" />
							<p className="mb-0 text-white mb-3 ml-4">Effective as of 2021/08/11 0:00 AM (UTC)</p>
						</div>
						<div className="col-md-6 d-flex justify-content-start align-items-start">
							<img src={Stick} alt="stick" />
							<p className="mb-0 text-white mb-3 ml-4">
								There is no limit to the number of friends you can refer, although we do reserve the right to
								adjust or change the referral program rules at any time.
							</p>
						</div>
						<div className="col-md-6 d-flex justify-content-start align-items-start">
							<img src={Stick} alt="stick" />
							<p className="mb-0 text-white mb-3 ml-4">
								The commission you receive from the referral program will initially be set at a rate of 90%.
							</p>
						</div>

						<div className="col-md-6 d-flex justify-content-start align-items-start">
							<img src={Stick} alt="stick" />
							<p className="mb-0 text-white mb-3 ml-4">
								Each referee must be signed up through your Referral Link, QR Code or Referral ID.
							</p>
						</div>
						<div className="col-md-6 d-flex justify-content-start align-items-start">
							<img src={Stick} alt="stick" />
							<p className="mb-0 text-white mb-3 ml-4">
								The fee commission will be sent instantly in real-time to your CX account as your referee
								completes each trade and will be paid to you in whatever token/cryptocurrency the original fee was
								paid in.
							</p>
						</div>
						<div className="col-md-6 d-flex justify-content-start align-items-start">
							<img src={Stick} alt="stick" />
							<p className="mb-0 text-white mb-3 ml-4">
								CX will check for duplicate or fake accounts and will not pay out referral bonuses on these
								accounts. Duplicate or shared finances will result in disqualification.
							</p>
						</div>
					</div>
					<div className="td-mobile-pg-referral__detail__container__notice">
						<div className="row">
							<div className="col-12">
								<p className="text-white">
									<img src={Stick} alt="stick" /> Important Notice:
								</p>
								<p className="text-white">
									CX reserves the right to change the terms of the referral program at any time due to changing
									market conditions, risk of fraud, or any other factors we deem relevant.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="td-mobile-pg-referral">
			{renderBannerReferral()}
			{renderReferralRank()}
			{renderUsersLoggedIn()}
			{renderProgramDetail()}
			<ReactTooltip />
		</div>
	);
};
