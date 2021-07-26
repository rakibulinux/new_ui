import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { logoutFetch, selectUserLoggedIn } from '../../modules';

import { FaHistory, FaSignOutAlt, FaStar, FaUserCircle } from 'react-icons/fa';

const Logo = require('../../assets/images/logo.svg');

export const Header: React.FC = () => {
	const history = useHistory();
	const intl = useIntl();

	const isLoggedIn = useSelector(selectUserLoggedIn);

	const dispatch = useDispatch();

	const renderWalletLink = () => {
		return (
			isLoggedIn && (
				<div className="header__right-menu__item ">
					<div className="header__right-menu__item__title">
						<Link to="/wallets">Wallet</Link>
					</div>
				</div>
			)
		);
	};

	const renderOrderTab = () => {
		return (
			isLoggedIn && (
				<div className="header__right-menu__dropdown__wrap">
					<span className="header__right-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center">
						{translate('page.body.landing.header.orders')}
						<div className="header__right-menu__dropdown__wrap__dropbtn__icon-drop-down"> </div>
					</span>
					<div className="header__right-menu__dropdown__wrap__content">
						<Link to="/orders">
							<div className="header__right-menu__dropdown__wrap__content__title d-flex align-items-center">
								<FaStar className="mr-2" />
								{translate('page.body.landing.header.openOrder')}
							</div>
						</Link>
						<Link to="/history">
							<div className="header__right-menu__dropdown__wrap__content__title d-flex align-items-center">
								<FaHistory className="header__right-menu__dropdown__wrap__content__title__icon mr-2" />
								{translate('page.body.landing.header.history')}
							</div>
						</Link>
					</div>
				</div>
			)
		);
	};

	const renderLogout = () => {
		if (!isLoggedIn) {
			return null;
		}

		return (
			<Link to=" " onClick={() => dispatch(logoutFetch())}>
				<div className="header__right-menu__dropdown__wrap__content__title d-flex align-items-center">
					<FaSignOutAlt className="header__right-menu__dropdown__wrap__content__title__icon mr-2" />
					<FormattedMessage id={'page.body.profile.content.action.logout'} />
				</div>
			</Link>
		);
	};

	const renderProfileLink = () => {
		return (
			isLoggedIn && (
				<Link to="/profile">
					<div className="header__right-menu__dropdown__wrap__content__title d-flex align-items-center">
						<FaUserCircle className="header__right-menu__dropdown__wrap__content__title__icon mr-2" />
						<FormattedMessage id={'page.header.navbar.profile'} />
					</div>
				</Link>
			)
		);
	};

	const renderProfileTab = () => {
		return (
			isLoggedIn && (
				<>
					<div className="header__right-menu__dropdown__wrap">
						<span className="header__right-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center">
							{translate('page.body.landing.header.account')}
							<div className="header__right-menu__dropdown__wrap__dropbtn__icon-drop-down"> </div>
						</span>
						<div className="header__right-menu__dropdown__wrap__content header__right-menu__dropdown__wrap__content--account">
							{renderProfileLink()}
							{renderLogout()}
						</div>
					</div>
				</>
			)
		);
	};

	const redirectSingIn = () => {
		history.push('/login');
	};

	const redirectSingUp = () => {
		history.push('/register');
	};

	const translate = (key: string) => intl.formatMessage({ id: key });

	const renderUnLogin = () => {
		return (
			!isLoggedIn && (
				<>
					<div className="header__right-menu__item flex-shrink-0 custom-poiter" onClick={e => redirectSingIn()}>
						<div className="header__right-menu__item__title">
							<span>{translate('page.body.landing.header.button2')}</span>
						</div>
					</div>
					<div className="header__right-menu__item flex-shrink-0 custom-poiter" onClick={e => redirectSingUp()}>
						<span className="header__right-menu__item__title header__right-menu__item__title--btn">
							{translate('page.body.landing.header.button3')}
						</span>
					</div>
				</>
			)
		);
	};

	return (
		<div className="headerDesktop-screen">
			<div className="container-header">
				<nav className="header d-flex flex-row justify-content-between align-items-center">
					<div className="header__left-menu d-flex flex-row align-items-center">
						<div className="header__left-menu__logo">
							<Link to="/">
								<img src={Logo} alt="" />
							</Link>
						</div>

						<div className="header__left-menu__dropdown flex-shrink-0">
							<div className="header__left-menu__dropdown__wrap">
								<Link
									to="/markets"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Markets
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0 ">
							<div className="header__left-menu__dropdown__wrap">
								<Link
									to="/ieo"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Launchpad
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0  ">
							<div className="header__left-menu__dropdown__wrap">
								<Link
									to="/trading-competition"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Competition
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0 d-none d-lg-block d-xl-block ">
							<div className="header__left-menu__dropdown__wrap">
								<Link
									to="/stake"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Stake
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0  ">
							<div className="header__left-menu__dropdown__wrap">
								<Link
									to="/airdrops"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Airdrop
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0  ">
							<div className="header__left-menu__dropdown__wrap">
								<Link
									to="/vote"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Vote Listing
								</Link>
							</div>
						</div>
					</div>

					<div className="header__right-menu d-flex align-items-center flex-row">
						{renderUnLogin()}
						{renderWalletLink()}
						{renderOrderTab()}
						{renderProfileTab()}
					</div>
				</nav>
			</div>
		</div>
	);
};
