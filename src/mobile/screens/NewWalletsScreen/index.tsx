import { Empty } from 'antd';
import classnames from 'classnames';
import { ConvertUsd } from 'components';
import { calcWalletsData } from 'helpers';
import { useAllChildCurrenciesFetch, useDocumentTitle, useWalletsFetch } from 'hooks';
import { SearchIcon } from 'mobile/assets/icons';
import { EstimatedValue } from 'mobile/components/EstimatedValue';
import React, { useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectAllChildCurrencies, selectWallets, Wallet } from '../../../modules';

export const NewWalletsMobileScreen = () => {
	useDocumentTitle('Wallets');

	useWalletsFetch();
	useAllChildCurrenciesFetch();

	const wallets = useSelector(selectWallets);
	const allChildCurrencies = useSelector(selectAllChildCurrencies);

	const [searchString, setSearchString] = useState<string>('');
	const [hideSmallBalance, setHideSmallBalance] = useState<boolean>(false);

	const allChildCurrencyName = allChildCurrencies.map(_e => _e.id);

	const data = calcWalletsData(wallets, allChildCurrencies).filter(({ currency, total }) => {
		if (!currency.includes(searchString.toLowerCase().trim())) {
			return false;
		}
		if (hideSmallBalance && Number(total) <= 0) {
			return false;
		}

		return !allChildCurrencyName.includes(currency);
	});

	const renderWalletList = (walletsParam: Wallet[]) => {
		return walletsParam.map(_w => (
			<Link to={`/wallets/${_w.currency}/detail`} className="td-mobile-wallets__list__item" key={_w.currency}>
				<div className="td-mobile-wallets__list__item__top">
					<div className="td-mobile-wallets__list__item__top__icon">
						<img src={_w.iconUrl} alt={_w.name} />
					</div>
					<span className="td-mobile-wallets__list__item__top__text">{_w.currency.toUpperCase()}</span>
					<span className="td-mobile-wallets__list__item__top__number">{_w.total}</span>
				</div>
				<div className="td-mobile-wallets__list__item__bottom">
					<span className="td-mobile-wallets__list__item__bottom__text">{_w.name}</span>
					<span className="td-mobile-wallets__list__item__bottom__number">
						<ConvertUsd value={Number(_w.total)} symbol={_w.currency} precision={4} defaultValue="0.00" /> $
					</span>
				</div>
			</Link>
		));
	};

	return (
		<div className="td-mobile-wallets">
			<EstimatedValue />
			<div className="td-mobile-wallets__header">
				<label className="td-mobile-wallets__header__search-box" htmlFor="td-mobile-wallets-search-box">
					<SearchIcon className="td-mobile-wallets__header__search-box__icon" />
					<DebounceInput
						id="td-mobile-wallets-search-box"
						className="td-mobile-wallets__header__search-box__input"
						debounceTimeout={500}
						onChange={e => setSearchString(e.target.value)}
					/>
				</label>

				<div className="td-mobile-wallets__header__toggle">
					<span className="td-mobile-wallets__header__toggle__text">Hide small balance</span>
					<label
						className={classnames('td-mobile-wallets__header__toggle__checkbox', {
							'td-mobile-wallets__header__toggle__checkbox--checked': hideSmallBalance,
						})}
						htmlFor="td-mobile-wallet-hide-small-balance"
					>
						<input
							id="td-mobile-wallet-hide-small-balance"
							className={classnames('td-mobile-wallets__header__toggle__checkbox__input', {
								'td-mobile-wallets__header__toggle__checkbox--checked__input': hideSmallBalance,
							})}
							type="checkbox"
							onChange={e => setHideSmallBalance(e.target.checked)}
						/>
						<div
							className={classnames('td-mobile-wallets__header__toggle__checkbox__dot', {
								'td-mobile-wallets__header__toggle__checkbox--checked__dot': hideSmallBalance,
							})}
						/>
					</label>
				</div>
			</div>
			<div className="td-mobile-wallets__list">{data.length === 0 ? <Empty /> : renderWalletList(data)}</div>
		</div>
	);
};
