import { useConvertToUSD } from 'hooks';
import { Wallet } from 'modules';
import React, { FC } from 'react';

export const NewWalletListItem:FC<Wallet> = ({
	currency, total, balance, iconUrl, name,
}) => {

	const estimation = useConvertToUSD(Number(total), currency, 4);

	return (
		<div className="td-mobile-wallets__list__item">
			<div className="td-mobile-wallets__list__item__top">
				<img className="td-mobile-wallets__list__item__top__icon" src={iconUrl} alt={name} />
				<span className="td-mobile-wallets__list__item__top__symbol">{currency.toUpperCase()}</span>
			</div>
			<div className="td-mobile-wallets__list__item__bottom">
				<div>
					<span className="td-mobile-wallets__list__item__bottom__text">Estimation</span>
					<span className="td-mobile-wallets__list__item__bottom__number">
						≈$ {estimation}
					</span>
				</div>
				<div>
					<span className="td-mobile-wallets__list__item__bottom__text">Total</span>
					<span className="td-mobile-wallets__list__item__bottom__number">{total}</span>
				</div>
				<div>
					<span className="td-mobile-wallets__list__item__bottom__text">Availible</span>
					<span className="td-mobile-wallets__list__item__bottom__number">{balance}</span>
				</div>
			</div>
		</div>
	);
};
