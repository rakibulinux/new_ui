import { ConvertUsd } from 'components';
import { calcWalletsData } from 'helpers';
import { useAllChildCurrenciesFetch, useDocumentTitle, useMarketsFetch, useMarketsTickersFetch, useRangerConnectFetch, useWalletsFetch } from 'hooks';
import { GoBackIcon } from 'mobile/assets/icons';
import { MarketList } from 'mobile/components';
import { selectAllChildCurrencies, selectMarkets, selectWallets } from 'modules';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';

export const NewWalletDetail:FC = () => {
	useDocumentTitle('Wallets');

	useWalletsFetch();
	useAllChildCurrenciesFetch();

	const wallets = useSelector(selectWallets);
	const allChildCurrencies = useSelector(selectAllChildCurrencies);

	const { currency } = useParams<{ currency: string }>();
	const wallet = calcWalletsData(wallets, allChildCurrencies).find(_wallet => _wallet.currency === currency);

	const history = useHistory();

	if (!wallet) { history.goBack(); }

	// TODO: List Market
	useMarketsFetch();
	useMarketsTickersFetch();
	useRangerConnectFetch();

	const markets = useSelector(selectMarkets);
	const [listMarket, setListMarket] = useState(markets);

	useEffect(() => {
		if (markets.length > 0) {
		  setListMarket(markets);
		}
	  }, [markets]);

	return (
		<div className="td-mobile-wallet-detail" >

			<div className="td-mobile-wallet-detail__header" >
				<GoBackIcon
					className="td-mobile-wallet-detail__header__goback"
					onClick={() => history.goBack()}
				/>
				<h3 className="td-mobile-wallet-detail__header__title">Wallet Detail</h3>
				<Link
					className="td-mobile-wallet-detail__header__history"
					to={`/wallets/${wallet?.currency}/history`}>
					History
				</Link>
			</div>

			<div className="td-mobile-wallet-detail__panel" >
				<h2 className="td-mobile-wallet-detail__panel__title" >
					{wallet?.currency.toUpperCase()}/{wallet?.name}
				</h2>
				<div className="td-mobile-wallet-detail__panel__row" >
					<span className="td-mobile-wallet-detail__panel__row__text" >Total</span>
					<div className="td-mobile-wallet-detail__panel__row__number" >
						<span>{wallet?.total}</span> <br />
						<span className="td-mobile-wallet-detail__panel__row__number__estimate" >
							≈$&nbsp;
							<ConvertUsd
								value={Number(wallet?.total)}
								symbol={wallet?.currency || ''}
								precision={4}
								defaultValue={'0.00'}
							/>
						</span>
					</div>
				</div>
				<div className="td-mobile-wallet-detail__panel__row" >
					<span className="td-mobile-wallet-detail__panel__row__text" >Availible</span>
					<span className="td-mobile-wallet-detail__panel__row__number" >
						{wallet?.balance}
					</span>
				</div>
				<div className="td-mobile-wallet-detail__panel__row" >
					<span className="td-mobile-wallet-detail__panel__row__text" >Locked</span>
					<span className="td-mobile-wallet-detail__panel__row__number" >
						{wallet?.locked}
					</span>
				</div>

				<div className="td-mobile-wallet-detail__panel__buttons" >
					<Link
						to={`/wallets/${wallet?.currency}/withdraw`}
						className="td-mobile-wallet-detail__panel__buttons__btn"
					>
						Withdraw
					</Link>
					<Link
						to={`/wallets/${wallet?.currency}/deposit`}
						className="td-mobile-wallet-detail__panel__buttons__btn td-mobile-wallet-detail__panel__buttons__btn--green"
					>
						Deposit
					</Link>
				</div>
			</div>

			<div className="td-mobile-wallet-detail__market" >
				<span className="td-mobile-wallet-detail__market__title" >Market list</span>
				<MarketList isShowTHead={false} listMarket={listMarket} />
			</div>

		</div>
	);
};
