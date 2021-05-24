import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useCurrenciesFetch, useDocumentTitle, useWalletsFetch } from '../../../hooks';
import { allChildCurrenciesFetch, selectAllChildCurrencies, selectWallets } from '../../../modules/user/wallets';
import { EstimatedValueMobile, WalletItem } from '../../components';

const WalletsMobileScreen: React.FC = () => {
	const wallets = useSelector(selectWallets) || [];
	const all_child_currencies = useSelector(selectAllChildCurrencies) || [];

	const history = useHistory();

	useWalletsFetch();
	useCurrenciesFetch();
	useDocumentTitle('Wallets');
	const dispatch = useDispatch();

	const dispatchcFetchAllChildCurrencies = () => dispatch(allChildCurrenciesFetch());
	// side effect
	React.useEffect(() => {
		dispatchcFetchAllChildCurrencies();
	}, []);

	return (
		<div>
			<EstimatedValueMobile />
			{wallets
				.filter(wallet => !all_child_currencies.map(cur => cur.id).includes(wallet.currency))
				.map((wallet, index) => (
					<WalletItem onClick={c => history.push(`/wallets/${c}/history`)} wallet={wallet} key={index} />
				))}
		</div>
	);
};

export { WalletsMobileScreen };
