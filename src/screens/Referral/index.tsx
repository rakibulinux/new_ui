import * as React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

import { ReferralContent } from 'containers';
import { selectSignInRequire2FA } from 'modules';

export const Referral: React.FC = () => {

	const history = useHistory();
	const isLoggedIn = useSelector(selectSignInRequire2FA);
	console.log(isLoggedIn)

	const Banner_Referral = require('./Assets/banner_Referral.png');
	const RankNo1 = require('./Assets/rank.No1.svg');
	const LoginReferral = require('./Assets/LoginReferral.svg');
	const Stick = require('./Assets/stick.svg');


	const renderBannerReferral = () => {
		return (
			<div className="referral-banner" style={{
				backgroundImage: 'url(' + Banner_Referral + ')',
			}}
			>
			</div>
		)
	}
	const renderReferralRank = () => {
		return (
			<div className="referral-rank">
				<div className="container">
					<div className="referral-row">
						<div className="referral-row__box">
							<div className="referral-row__box__row">
								<div className="referral-row__box__row__rank">
									<img src={RankNo1} alt="No.1" />
									<div className="top-rank">
										<span className="top-rank__top">NO.1</span>
										<span className="top-rank__mail">abc@gmail.com</span>
									</div>
								</div>
								<div className="referral-row__box__row__commission ml-4">
									<span className="referral-row__box__row__commission__title">Commission</span>
									<span className="referral-row__box__row__commission__coin-name">62.147 BTC</span>
								</div>
							</div>
						</div>
						<div className="referral-row__box">
							<div className="referral-row__box__row">
								<div className="referral-row__box__row__rank">
									<img src={RankNo1} alt="No.1" />
									<div className="top-rank">
										<span className="top-rank__top">NO.1</span>
										<span className="top-rank__mail">abc@gmail.com</span>
									</div>
								</div>
								<div className="referral-row__box__row__commission ml-4">
									<span className="referral-row__box__row__commission__title">Commission</span>
									<span className="referral-row__box__row__commission__coin-name">62.147 BTC</span>
								</div>
							</div>
						</div>
						<div className="referral-row__box">
							<div className="referral-row__box__row">
								<div className="referral-row__box__row__rank">
									<img src={RankNo1} alt="No.1" />
									<div className="top-rank">
										<span className="top-rank__top">NO.1</span>
										<span className="top-rank__mail">abc@gmail.com</span>
									</div>
								</div>
								<div className="referral-row__box__row__commission ml-4">
									<span className="referral-row__box__row__commission__title">Commission</span>
									<span className="referral-row__box__row__commission__coin-name">62.147 BTC</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
	const renderUserisLoggedIn = () => {

		if (isLoggedIn) {
			return <ReferralContent />;
		}

		else {
			return (
				<div className="referral-loggedIn">
					<div className="container">
						<div className="referral-loggedIn-userLogIn" style={{
							backgroundImage: 'url(' + LoginReferral + ')',
						}}
						>
							<div className="referral-loggedIn-userLogIn__wrapper">
								<div className="referral-loggedIn-userLogIn__wrapper__desription">
									You are not logged in, please login and share with your friends.
								</div>
								<div className="referral-loggedIn-userLogIn__wrapper__login">
									<button onClick={redirectToLogin}>Login</button>
									<p> Not on CX yet?<span onClick={redirectToRegister}>Register</span></p>
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
	}

	const redirectToLogin = (): void | any => {
		history.push("/login");
	}
	const redirectToRegister = (): void | any => {
		history.push("/register");
	}
	const renderProgramDetail = () => {
		return (
			<div className="referral-detail">
				<div className="container">
					<h2 className="text-white">Program Details</h2>
					<div className="row">
						<div className="col-md-6 d-flex justify-content-start align-items-start">
							<img src={Stick} alt="stick" />
							<p className="mb-0 text-white mb-5 ml-4">Effective as of 2019/06/01 0:00 AM (UTC)</p>
						</div>
						<div className="col-md-6 d-flex justify-content-start align-items-start">
							<img src={Stick} alt="stick" />
							<p className="mb-0 text-white mb-5 ml-4">There is no limit to the number of friends you can refer, although we do reserve the right to adjust or change the referral program rules at any time.</p>
						</div>
						<div className="col-md-6 d-flex justify-content-start align-items-start">
							<img src={Stick} alt="stick" />
							<p className="mb-0 text-white mb-5 ml-4">The commission you receive from the referral program will initially be set at a rate of 90%.</p>
						</div>

						<div className="col-md-6 d-flex justify-content-start align-items-start">
							<img src={Stick} alt="stick" />
							<p className="mb-0 text-white mb-5 ml-4">Each referee must be signed up through your Referral Link, QR Code or Referral ID.</p>
						</div>
						<div className="col-md-6 d-flex justify-content-start align-items-start">
							<img src={Stick} alt="stick" />
							<p className="mb-0 text-white mb-5 ml-4">The fee commission will be sent instantly in real-time to your CX account as your referee completes each trade and will be paid to you in whatever token/cryptocurrency the original fee was paid in.</p>
						</div>
						<div className="col-md-6 d-flex justify-content-start align-items-start">
							<img src={Stick} alt="stick" />
							<p className="mb-0 text-white mb-5 ml-4">CX will check for duplicate or fake accounts and will not pay out referral bonuses on these accounts. Duplicate or shared finances will result in disqualification.</p>
						</div>
					</div>
					<div className="notice">
						<div className="row">
							<div className="col-md-12 d-flex justify-content-start align-items-start">
								<img src={Stick} alt="stick" />
								<p className="text-white ml-4">Important Notice:</p>
							</div>
							<div className="ml-5">
								<span className="text-white">CX reserves the right to change the terms of the referral program at any time due to changing market conditions, risk of fraud, or any other factors we deem relevant.</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
	return (
		<div id="referral">
			{renderBannerReferral()}
			{renderReferralRank()}
			{renderUserisLoggedIn()}
			{renderProgramDetail()}
		</div>
	);
}
