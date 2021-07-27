import classNames from 'classnames';
import * as React from 'react';
import { FaHistory, FaSignOutAlt, FaStar, FaUserCircle } from 'react-icons/fa';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { logoutFetch, selectUserLoggedIn } from '../../modules';

const Logo = require('../../assets/images/logo.svg');

export const Header: React.FC = () => {
	const history = useHistory();
	const intl = useIntl();
	const isLoggedIn = useSelector(selectUserLoggedIn);
	const [activeNow, setActiveNow] = React.useState('');

	const dispatch = useDispatch();

	const renderWalletLink = () => {
		const classItemTitle = classNames('header__right-menu__item__title', {
			'header__right-menu__item__title--active': activeNow === 'Wallet',
		});

		return (
			isLoggedIn && (
				<div className="header__right-menu__item ">
					<div className={classItemTitle} onClick={() => setActiveNow('Wallet')}>
						<Link to="/wallets">Wallet</Link>
					</div>
				</div>
			)
		);
	};

	const renderOrderTab = () => {
		const classActiveLink = classNames('header__right-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center', {
			'header__right-menu__dropdown__wrap__dropbtn--active': activeNow === 'orders',
		});

		return (
			isLoggedIn && (
				<div className="header__right-menu__dropdown__wrap">
					<span className={classActiveLink}>
						{translate('page.body.landing.header.orders')}
						<div className="header__right-menu__dropdown__wrap__dropbtn__icon-drop-down"> </div>
					</span>
					<div className="header__right-menu__dropdown__wrap__content">
						<Link to="/orders" onClick={() => setActiveNow('orders')}>
							<div className="header__right-menu__dropdown__wrap__content__title d-flex align-items-center">
								<FaStar className="mr-2" />
								{translate('page.body.landing.header.openOrder')}
							</div>
						</Link>
						<Link to="/history" onClick={() => setActiveNow('orders')}>
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
			<Link
				to=" "
				onClick={() => {
					dispatch(logoutFetch());
					setActiveNow('account');
				}}
			>
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
				<Link to="/profile" onClick={() => setActiveNow('account')}>
					<div className="header__right-menu__dropdown__wrap__content__title d-flex align-items-center">
						<FaUserCircle className="header__right-menu__dropdown__wrap__content__title__icon mr-2" />
						<FormattedMessage id={'page.header.navbar.profile'} />
					</div>
				</Link>
			)
		);
	};

	const renderProfileTab = () => {
		const classActiveLink = classNames('header__right-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center', {
			'header__right-menu__dropdown__wrap__dropbtn--active': activeNow === 'account',
		});

		return (
			isLoggedIn && (
				<>
					<div className="header__right-menu__dropdown__wrap">
						<span className={classActiveLink}>
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

	const classLinkActive = (nameActive: string) => {
		return classNames('header__left-menu__dropdown__wrap', {
			'header__left-menu__dropdown__wrap--active': activeNow === nameActive,
		});
	};

	return (
		<div className="headerDesktop-screen">
			<div className="container-header">
				<nav className="header d-flex flex-row justify-content-between align-items-center">
					<div className="header__left-menu d-flex flex-row align-items-center">
						<div className="header__left-menu__logo" onClick={() => setActiveNow('')}>
							<Link to="/">
								<img src={Logo} alt="" />
							</Link>
						</div>

						<div className="header__left-menu__dropdown flex-shrink-0">
							<div className={classLinkActive('markets')} onClick={() => setActiveNow('markets')}>
								<Link
									to="/markets"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Markets
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0 ">
							<div className={classLinkActive('ieo')} onClick={() => setActiveNow('ieo')}>
								<Link
									to="/ieo"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Launchpad
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0  ">
							<div
								className={classLinkActive('trading-competition')}
								onClick={() => setActiveNow('trading-competition')}
							>
								<Link
									to="/trading-competition"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Competition
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0 d-none d-lg-block d-xl-block ">
							<div className={classLinkActive('stake')} onClick={() => setActiveNow('stake')}>
								<Link
									to="/stake"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Stake
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0  ">
							<div className={classLinkActive('airdrops')} onClick={() => setActiveNow('airdrops')}>
								<Link
									to="/airdrops"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Airdrop
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0  ">
							<div className={classLinkActive('vote')} onClick={() => setActiveNow('vote')}>
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
