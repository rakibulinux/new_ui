import { Empty } from 'antd';
import { calcWalletsData } from 'helpers';
import { useAllChildCurrenciesFetch, useConvertToUSD, useDocumentTitle, useWalletsFetch } from 'hooks';
import { SearchIcon } from 'mobile/assets/icons';
import React, { useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { useSelector } from 'react-redux';
import { selectAllChildCurrencies, selectWallets } from '../../../modules';
import { NewWalletListItem } from './NewWalletListItem';

export const NewWalletsMobileScreen = () => {
	useDocumentTitle('Wallets');

	useWalletsFetch();
	useAllChildCurrenciesFetch();

	const wallets = useSelector(selectWallets);
	const allChildCurrencies = useSelector(selectAllChildCurrencies);

	const [searchString, setSearchString] = useState<string>('');
	const [hideSmallBalance, setHideSmallBalance] = useState<boolean>(false);

	const data = calcWalletsData(wallets, allChildCurrencies)
		.filter(({currency, total}) =>
			currency.includes(searchString.toLowerCase().trim())
			&& (hideSmallBalance ? Number(total) > 0 : true),
		);

	return (
		<div className="td-mobile-wallets">
			<div className="td-mobile-wallets__header" >

				<label className="td-mobile-wallets__header__search-box" htmlFor="td-mobile-wallets-search-box" >
					<SearchIcon className="td-mobile-wallets__header__search-box__icon" />
					<DebounceInput
						id="td-mobile-wallets-search-box"
						className="td-mobile-wallets__header__search-box__input"
						debounceTimeout={500}
						onChange={e => setSearchString(e.target.value)}
					/>
				</label>

				<div className="td-mobile-wallets__header__toggle" >
					<span className="td-mobile-wallets__header__toggle__text">Hide small balance</span>
					<label className="td-mobile-wallets__header__toggle__checkbox" htmlFor="td-mobile-wallet-hide-small-balance">
						<input
							id="td-mobile-wallet-hide-small-balance"
							className="td-mobile-wallets__header__toggle__checkbox__input"
							type="checkbox"
							onChange={e => setHideSmallBalance(e.target.checked)}
						/>
						<div className="td-mobile-wallets__header__toggle__checkbox__dot" />
					</label>
				</div>
			</div>
			<div className="td-mobile-wallets__list" >
			{
				data.length === 0
				? <Empty />
				: data.map(wallet => <NewWalletListItem key={wallet.currency} {...wallet} />)
			}
			</div>
		</div>
	);
};
