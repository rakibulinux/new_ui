import classnames from 'classnames';
import { selectUserInfo, selectUserLoggedIn, selectWallets } from 'modules';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

// tslint:disable-next-line: no-empty-interface
interface ProfileActiveStepProps {}

export const ProfileActiveStep: React.FC<ProfileActiveStepProps> = () => {
	const history = useHistory();
	const isLoggedIn = useSelector(selectUserLoggedIn);
	const user = useSelector(selectUserInfo);
	const wallet = useSelector(selectWallets);

	const isExistBalance =
		wallet.reduce((prev, current) => {
			const result = prev + (current.balance ? +current.balance : 0);

			return result;
		}, 0) > 0;

	const svgActive = (
		<svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M3.99993 7.8L1.19993 5L0.266602 5.93334L3.99993 9.66667L11.9999 1.66667L11.0666 0.733337L3.99993 7.8Z"
				fill="white"
			/>
		</svg>
	);

	const handleNavigateTo2fa = () => {
		if (!user.otp) {
			history.push('/security/2fa', { enable2fa: !user.otp });
		}
	};

	const handleToWallet = () => {
		history.push('/wallets');
	};

	return (
		<div className="td-pg-profile--radius td-pg-profile__active-step">
			<h1 className="td-pg-profile__active-step__tile">Welcome to CiRCLEEX</h1>
			<span className="td-pg-profile__active-step__desc">Just a few more steps and you’re good to go!</span>
			<div className="td-pg-profile__active-step__content d-flex">
				<div className="td-pg-profile__active-step__content__item">
					<span
						className={classnames('td-pg-profile__active-step__content__item__step', {
							'td-pg-profile__active-step__content__item__step--active': isLoggedIn,
						})}
					>
						{isLoggedIn ? svgActive : '1'}
					</span>
					<h5 className="td-pg-profile__active-step__content__item__title">Register Account</h5>
				</div>
				<div className="td-pg-profile__active-step__content__item">
					<span
						className={classnames('td-pg-profile__active-step__content__item__step', {
							'td-pg-profile__active-step__content__item__step--active': isLoggedIn && user.otp,
						})}
					>
						{user.otp ? svgActive : '2'}
					</span>
					<h5 className="td-pg-profile__active-step__content__item__title">2FA</h5>
					<span className="td-pg-profile--color--second td-pg-profile__active-step__content__item__desc">
						Secure your account with two- factor authentication！
					</span>
					{!user.otp ? (
						<Button
							size="sm"
							className="td-pg-profile__active-step__content__item__action mt-3"
							onClick={handleNavigateTo2fa}
						>
							Verify
						</Button>
					) : null}
				</div>
				<div className="td-pg-profile__active-step__content__item">
					<span
						className={classnames('td-pg-profile__active-step__content__item__step', {
							'td-pg-profile__active-step__content__item__step--active': user.otp && isExistBalance,
						})}
					>
						{isExistBalance ? svgActive : '3'}
					</span>
					<h5 className="td-pg-profile__active-step__content__item__title">Deposit Funds</h5>
					<span className="td-pg-profile--color--second td-pg-profile__active-step__content__item__desc">
						Add cash or crypto funds to your wallet and start trading right away
					</span>
					{user.otp && !isExistBalance ? (
						<Button
							size="sm"
							className="td-pg-profile__active-step__content__item__action mt-3"
							onClick={handleToWallet}
						>
							To Wallet
						</Button>
					) : null}
				</div>
			</div>
			<img className="td-pg-profile__active-step__mask-icon" src={require('assets/images/profile/maskIconToStep.svg')} />
		</div>
	);
};
