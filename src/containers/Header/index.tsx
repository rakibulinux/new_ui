import * as React from 'react';
// import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import {
	changeUserDataFetch,
	logoutFetch,
	Market,
	RootState,
	selectCurrentMarket,
	selectUserInfo,
	selectUserLoggedIn,
	User,
	selectMarketSelectorState,
	selectMobileWalletUi,
	selectSidebarState,
	setMobileWalletUi,
	toggleMarketSelector,
	toggleSidebar,
} from '../../modules';
// import { IntlProps } from '../../index';

// import styled from 'styled-components';
import { /* FaCog, */ FaStar, FaHistory, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
// interface State {
//     isOpenDrop: boolean;
//   }

// interface OwnProps {
//   onLinkChange?: () => void;
//   history: History;
//   changeUserDataFetch: typeof changeUserDataFetch;
// }

interface ReduxProps {
	isLoggedIn: boolean;
	currentMarket: Market | undefined;
	user: User;
	mobileWallet: string;
	sidebarOpened: boolean;
	marketSelectorOpened: boolean;
}

interface DispatchProps {
	logoutFetch: typeof logoutFetch;
	setMobileWalletUi: typeof setMobileWalletUi;
	toggleSidebar: typeof toggleSidebar;
	toggleMarketSelector: typeof toggleMarketSelector;
	changeUserDataFetch: typeof changeUserDataFetch;
}

// interface HistoryProps {
//   history: History;
// }

// type Props = OwnProps & ReduxProps & HistoryProps & IntlProps & DispatchProps;

const Logo = require('../../assets/images/logo.svg');

export const Header: React.FC = () => {
	// const [isOpenDrop , setIsOpenDrop]  = useState(false);

	const props = useSelector(
		(state: RootState): ReduxProps => ({
			isLoggedIn: selectUserLoggedIn(state),
			currentMarket: selectCurrentMarket(state),
			user: selectUserInfo(state),
			mobileWallet: selectMobileWalletUi(state),
			sidebarOpened: selectSidebarState(state),
			marketSelectorOpened: selectMarketSelectorState(state),
		}),
	);

	const dispatch = useDispatch();
	const listFunction: DispatchProps = {
		logoutFetch: () => dispatch(logoutFetch()),
		changeUserDataFetch: payload => dispatch(changeUserDataFetch(payload)),
		toggleSidebar: payload => dispatch(toggleSidebar(payload)),
		toggleMarketSelector: () => dispatch(toggleMarketSelector()),
		setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
	};

	const history = useHistory();
	const intl = useIntl();

	const renderWalletLink = () => {
		const { isLoggedIn } = props;

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
		const { isLoggedIn } = props;

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
								{translate('page.body.landing.header.order')}
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
		const { isLoggedIn } = props;

		if (!isLoggedIn) {
			return null;
		}
		return (
			<Link to=" " onClick={() => listFunction.logoutFetch()}>
				<div className="header__right-menu__dropdown__wrap__content__title d-flex align-items-center">
					<FaSignOutAlt className="header__right-menu__dropdown__wrap__content__title__icon mr-2" />
					<FormattedMessage id={'page.body.profile.content.action.logout'} />
				</div>
			</Link>
		);
	};

	const renderProfileLink = () => {
		const { isLoggedIn } = props;
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
		const { isLoggedIn } = props;

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

					{/* <div className="header__right-menu__item flex-shrink-0 d-none d-xl-block">
						<div className="header__right-menu__item__title">
							<Link to="/download">Download</Link>
						</div>
					</div> */}
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
		const { isLoggedIn } = props;

		return (
			!isLoggedIn && (
				<>
					<div className="header__right-menu__item flex-shrink-0 custom-poiter" onClick={e => redirectSingIn()}>
						<div className="header__right-menu__item__title d-none d-xl-block">
							<span>{translate('page.body.landing.header.button2')}</span>
						</div>
					</div>
					<div className="header__right-menu__item flex-shrink-0 custom-poiter" onClick={e => redirectSingUp()}>
						<span className="header__right-menu__item__title header__right-menu__item__title--btn">
							{translate('page.body.landing.header.button3')}
						</span>
					</div>
					{/* <div className="header__right-menu__item flex-shrink-0 d-none d-xl-block custom-poiter">
						<div className="header__right-menu__item__title">
							<Link to="/download">Download</Link>
						</div>
					</div>
					<div className="header__right-menu__item  custom-poiter">
						<div className="header__right-menu__item__title d-none d-xl-block">
							<span>English | USD</span>
						</div>
					</div>
					<div className="header__right-menu__item ">
						<div className="header__right-menu__item__title d-none d-xl-block custom-poiter">
							<span>
								<FaCog className="header__right-menu__item__title__icon" />
							</span>
						</div>
					</div> */}
				</>
			)
		);
	};

	const renderHeaderDesktop = () => {
		return (
			<div className="container-header">
				<nav className="header d-flex flex-row justify-content-between align-items-center">
					<div className="header__left-menu d-flex flex-row align-items-center">
						<div className="header__left-menu__logo">
							<Link to="/">
								<img src={Logo} alt="" />
							</Link>
						</div>

						{/* <div className="header__left-menu__dropdown  header__left-menu__dropdown--mg-large flex-shrink-0 custom-poiter">
							<div className="header__left-menu__dropdown__wrap">
								<span className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center">
									<div className="header__left-menu__dropdown__wrap__dropbtn__svg">
										<svg viewBox="0 0 1024 1024">
											<path
												d="M599.381333 424.618667H424.618667v174.762666h174.762666V424.618667z m0-253.952H424.618667v174.293333h174.762666V170.666667z m0 508.373333H424.618667V853.333333h174.762666v-174.293333zM344.96 424.618667H170.666667v174.762666h174.293333V424.618667zM853.333333 170.666667h-174.293333v174.293333H853.333333V170.666667z m0 508.373333h-174.293333V853.333333H853.333333v-174.293333z m-508.373333 0H170.666667V853.333333h174.293333v-174.293333zM853.333333 424.618667h-174.293333v174.762666H853.333333V424.618667zM344.96 170.666667H170.666667v174.293333h174.293333V170.666667z"
												fill="#f8f8f8"
											></path>
										</svg>
									</div>
								</span>
								<div className="header__left-menu__dropdown__wrap__content">
									<Link to="Link 1">
										<div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
											<FaStar className="mr-2" />
											Link 1
										</div>
										<div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc</div>
									</Link>
								</div>
							</div>
						</div> */}

						{/* <div className="header__left-menu__dropdown  flex-shrink-0">
							<div className="header__left-menu__dropdown__wrap">
								<span className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center">
									Buy Crypto
									<div className="header__left-menu__dropdown__wrap__dropbtn__tag-icon p-2 flex-grow-1">
										USD
									</div>
									<div className="header__left-menu__dropdown__wrap__dropbtn__icon-drop-down"> </div>
								</span>
								<div className="header__left-menu__dropdown__wrap__content">
									<Link to="">
										<div className="header__left-menu__dropdown__wrap__content__title d-flex align-items-center">
											<FaStar className="mr-2" />
											Link 1
										</div>
										<div className="header__left-menu__dropdown__wrap__content__desc ml-4">desc</div>
									</Link>
								</div>
							</div>
						</div> */}

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
						{/* <div className="header__left-menu__dropdown flex-shrink-0">
							<div className="header__left-menu__dropdown__wrap">
								<Link
									to="/airdrop"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Airdrop Hub
								</Link>
							</div>
						</div> */}
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
									Trade Competition
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0  ">
							<div className="header__left-menu__dropdown__wrap">
								<Link
									to="/newhomepage"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									new homepage
								</Link>
							</div>
						</div>
						{/* <div className="header__left-menu__dropdown flex-shrink-0 d-none d-lg-block d-xl-block ">
							<div className="header__left-menu__dropdown__wrap">
								<Link
									to="/stake"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Stake
								</Link>
							</div>
						</div> */}
					</div>

					<div className="header__right-menu d-flex align-items-center flex-row">
						{renderUnLogin()}
						{renderWalletLink()}
						{renderOrderTab()}
						{renderProfileTab()}
					</div>
				</nav>
			</div>
		);
	};

	return (
		<div className="headerDesktop-screen">
			{renderHeaderDesktop()}
			{/* <HeaderStyle></HeaderStyle> */}
		</div>
	);
};
