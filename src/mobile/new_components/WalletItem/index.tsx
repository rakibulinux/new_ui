import { useConvertToUSD } from 'hooks';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

interface WalletItemProps {
	iconUrl: string;
	total: number;
	balance: number;
	locked?: number;
	type: string;
	currency: string;
	name: string;
}

export const WalletItem: FC<WalletItemProps> = ({ iconUrl, total, balance, currency, name }) => {
	const estimate = useConvertToUSD(total, currency);
	const history = useHistory();

	return (
		<div className="wallet-item" onClick={() => history.push(`/wallets/${currency}/history`)}>
			<div className="wallet-item__top">
				<img className="wallet-item__top__icon" src={iconUrl} alt={name} />
				<span className="wallet-item__top__currency">{currency.toUpperCase()}</span>
			</div>
			<div className="wallet-item__bottom">
				<div className="wallet-item__bottom__block wallet-item__bottom__block--flex-1">
					<span className="wallet-item__bottom__block__text">Estimation</span>
					<span className="wallet-item__bottom__block__number">≈¥ {estimate}</span>
				</div>
				<div className="wallet-item__bottom__block">
					<span className="wallet-item__bottom__block__text">Total</span>
					<span className="wallet-item__bottom__block__number">{total.toFixed(7)}</span>
				</div>
				<div className="wallet-item__bottom__block">
					<span className="wallet-item__bottom__block__text">Availible</span>
					<span className="wallet-item__bottom__block__number">{balance.toFixed(7)}</span>
				</div>
			</div>
		</div>
	);
};
