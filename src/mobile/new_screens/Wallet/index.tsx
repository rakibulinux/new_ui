import { calcWalletsData } from 'helpers';
import { useAllChildCurrenciesFetch, useDocumentTitle, useWalletsFetch } from 'hooks';
import { WalletHeader, WalletList } from 'mobile/new_components';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllChildCurrencies, selectWallets } from '../../../modules';

export const WalletsMobileScreen = () => {
	useDocumentTitle('Wallets');

	useWalletsFetch();
	useAllChildCurrenciesFetch();

	const wallets = useSelector(selectWallets);
	const allChildCurrencies = useSelector(selectAllChildCurrencies);

	const [searcString, setSearcString] = useState<string>('');
	const [hideSmallBalance, setHideSmallBalance] = useState<boolean>(false);

	const data = calcWalletsData(wallets, allChildCurrencies, searcString, hideSmallBalance);

	return (
		<div>
			<WalletHeader setSearchString={setSearcString} setHideSmallBalance={setHideSmallBalance} />
			<WalletList data={data} />
		</div>
	);
};
