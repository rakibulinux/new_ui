import classnames from 'classnames';
import { HomeIcon, MarketIcon, StakeIcon, TradeIcon, WalletIcon } from 'mobile/assets/icons';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DEFAULT_CLASSNAME = 'bottom-nav__item';

const handleGetActiveItemClass = (currentRoute: string, targetRoute: string, absolute?: boolean) => {
	return classnames(DEFAULT_CLASSNAME, {
		[`${DEFAULT_CLASSNAME}--active`]: absolute ? currentRoute === targetRoute : currentRoute.includes(targetRoute),
	});
};

export const BottomNavbar: React.FC = () => {
	const { pathname } = useLocation();

	return (
		<nav className="bottom-nav">
			<ul>
				<Link to="/" className={handleGetActiveItemClass(pathname, '/', true)}>
					<HomeIcon
						className="bottom-nav__item__icon"
						active={handleGetActiveItemClass(pathname, '/', true) !== DEFAULT_CLASSNAME}
					/>
					<span className="bottom-nav__item__text">Home</span>
				</Link>
				<Link to="/markets" className={handleGetActiveItemClass(pathname, '/markets')}>
					<MarketIcon
						className="bottom-nav__item__icon"
						active={handleGetActiveItemClass(pathname, '/markets') !== DEFAULT_CLASSNAME}
					/>
					<span className="bottom-nav__item__text">Market</span>
				</Link>
				<Link
					to="/tradding"
					className={classnames('bottom-nav__item--middle', handleGetActiveItemClass(pathname, '/trading'))}
				>
					<TradeIcon
						className="bottom-nav__item__icon bottom-nav__item--middle__icon"
						active={handleGetActiveItemClass(pathname, '/trading') !== DEFAULT_CLASSNAME}
					/>
					<span className="bottom-nav__item__text">Trade</span>
				</Link>
				<Link to="/stake" className={handleGetActiveItemClass(pathname, '/stake')}>
					<StakeIcon
						className="bottom-nav__item__icon"
						active={handleGetActiveItemClass(pathname, '/stake') !== DEFAULT_CLASSNAME}
					/>
					<span className="bottom-nav__item__text">Stake</span>
				</Link>
				<Link to="/wallets" className={handleGetActiveItemClass(pathname, '/wallets')}>
					<WalletIcon
						className="bottom-nav__item__icon"
						active={handleGetActiveItemClass(pathname, '/wallets') !== DEFAULT_CLASSNAME}
					/>
					<span className="bottom-nav__item__text">Wallet</span>
				</Link>
			</ul>
		</nav>
	);
};
