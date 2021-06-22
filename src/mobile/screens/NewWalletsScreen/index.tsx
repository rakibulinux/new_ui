import { calcWalletsData } from 'helpers';
import { useAllChildCurrenciesFetch, useDocumentTitle, useWalletsFetch } from 'hooks';
import { NewWalletHeader, NewWalletList } from 'mobile/components';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllChildCurrencies, selectWallets } from '../../../modules';

export const NewWalletsMobileScreen = () => {
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
			<NewWalletHeader setSearchString={setSearcString} setHideSmallBalance={setHideSmallBalance} />
			<NewWalletList data={data} />
		</div>
	);
};
