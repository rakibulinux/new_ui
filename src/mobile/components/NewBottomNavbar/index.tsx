import { HomeIcon, MarketIcon, SwapIcon, TradeIcon, WalletIcon } from 'mobile/assets/icons';
import React from 'react';
import { Link } from 'react-router-dom';

export const BottomNavbar = () => {
	return (
		<nav className="bottom-nav">
			<ul>
				<Link className="bottom-nav__item" to="/">
					<HomeIcon className="bottom-nav__item__icon" />
					<span className="bottom-nav__item__text">Home</span>
				</Link>
				<Link className="bottom-nav__item" to="/markets">
					<MarketIcon className="bottom-nav__item__icon" />
					<span className="bottom-nav__item__text">Market</span>
				</Link>
				<Link className="bottom-nav__item bottom-nav__item--middle" to="/tradding">
					<TradeIcon className="bottom-nav__item__icon bottom-nav__item--middle__icon" />
					<span className="bottom-nav__item__text">Trade</span>
				</Link>
				<Link className="bottom-nav__item" to="/">
					<SwapIcon className="bottom-nav__item__icon" />
					<span className="bottom-nav__item__text">Swap</span>
				</Link>
				<Link className="bottom-nav__item" to="/wallets">
					<WalletIcon className="bottom-nav__item__icon" />
					<span className="bottom-nav__item__text">Wallet</span>
				</Link>
			</ul>
		</nav>
	);
};
