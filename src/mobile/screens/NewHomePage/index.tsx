import { CrownOutlined, ExperimentOutlined, GiftOutlined, WalletOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDepthFetch, useEventsFetch, useMarketsFetch, useMarketsTickersFetch, useRangerConnectFetch } from '../../../hooks';
import { selectUserLoggedIn } from '../../../modules';
import { Avatar } from './../../assets/icons';
import { NewAllMarketList } from './../../components';
import { BoxImg } from './BoxImg';
import { MarketsTop } from './MarketTop';

const NewHomePage = () => {
	useMarketsFetch();
	useMarketsTickersFetch();
	useRangerConnectFetch();
	useDepthFetch();
	useEventsFetch();
	const userLoggedIn = useSelector(selectUserLoggedIn);
	const [linkToProfile, setLinkToProfile] = useState('/signin');
	useEffect(() => {
		if (userLoggedIn) {
			setLinkToProfile('/profile');
		} else {
			setLinkToProfile('/signin');
		}
	}, [userLoggedIn]);

	const renderDirectionals = () => {
		return (
			<React.Fragment>
				<div className="td-mobile-screen-home__direction__list-item">
					<Link to="/wallets" className="td-mobile-screen-home__direction__list-item__item">
						<WalletOutlined />
						<span>Deposit</span>
					</Link>

					<Link to="/ieo" className="td-mobile-screen-home__direction__list-item__item">
						<ExperimentOutlined />
						<span>IEO</span>
					</Link>

					<Link to="/airdrop" className="td-mobile-screen-home__direction__list-item__item">
						<GiftOutlined />
						<span>Airdrop</span>
					</Link>

					<Link to="/trading-competition" className="td-mobile-screen-home__direction__list-item__item">
						<CrownOutlined />
						<span>Competition</span>
					</Link>
				</div>
			</React.Fragment>
		);
	};

	return (
		<div className="td-mobile-screen-home">
			<div className="td-mobile-screen-home__header">
				<div className="td-mobile-screen-home__header__info">
					<Link to={linkToProfile}>
						<Avatar />
					</Link>
					<div className="td-mobile-screen-home__header__info__desc"></div>
				</div>
			</div>

			<div className="td-mobile-screen-home__box-img">
				<BoxImg />
			</div>

			<MarketsTop />

			<div className="td-mobile-screen-home__direction">{renderDirectionals()}</div>

			<div className="td-mobile-screen-home__market-main">
				<NewAllMarketList />
			</div>
		</div>
	);
};

export const HomePageScreenMobile = React.memo(NewHomePage);
