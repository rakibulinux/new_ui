import Tabs, { TabPane } from 'rc-tabs';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { getTabName } from '../../../helpers';
import { selectCurrencies } from '../../../modules';
import {
	selectChildCurrencies,
	selectWallets,
	walletsAddressFetch,
	walletsChildCurrenciesFetch,
	walletsFetch,
} from '../../../modules/user/wallets';
import { Subheader, WalletBanner, WalletDepositBody, WalletHeader } from '../../components';
interface EmptyWallet {
	name: string;
	currency: string;
	balance?: string;
	type: string;
	address?: string;
}

const WalletDeposit: React.FC = () => {
	const [generateAddressTriggered, setGenerateAddressTriggered] = React.useState(false);
	const [selectedWallet, setSelectedWallet] = React.useState<EmptyWallet>({
		currency: '',
		name: '',
		type: '',
		address: '',
		balance: '',
	});
	const dispatch = useDispatch();
	const intl = useIntl();
	const history = useHistory();
	const { currency = '' } = useParams<{ currency: string }>();
	const wallets = useSelector(selectWallets) || [];
	const currencies = useSelector(selectCurrencies);
	const currencyItem = currencies.find(cur => cur.id === currency.toLowerCase()) || { blockchain_key: '', name: '' };
	const wallet = wallets.find(item => item.currency === currency) || {
		currency: '',
		address: '',
		balance: '',
		type: 'fiat',
	};
	const parentWallet = {
		...wallet,
		name: currencyItem.name,
	};
	const isParentAccountActivated = parentWallet.type === 'fiat' || parentWallet.balance;
	const isChildAccountActivated = selectedWallet.type === 'fiat' || selectedWallet.balance;
	const dispatchFetchChildCurrencies = React.useCallback(() => dispatch(walletsChildCurrenciesFetch({ currency: currency })), [
		dispatch,
		currency,
	]);
	const childCurrencies = useSelector(selectChildCurrencies);
	React.useEffect(() => {
		dispatchFetchChildCurrencies();
	}, [currency, dispatchFetchChildCurrencies]);

	const childWallets = childCurrencies.map(childCurrency => {
		// tslint:disable-next-line:no-shadowed-variable
		const wallet = wallets.find(item => item.currency.toLowerCase() === childCurrency.id.toLowerCase()) || {
			currency: '',
			address: '',
			balance: '',
			type: 'fiat',
		};

		return {
			...wallet,
			name: childCurrency.name,
			currency: wallet.currency,
			blockchain_key: childCurrency.blockchain_key,
			address: wallet.address,
			balance: wallet.balance,
			type: wallet.type,
		};
	});

	// tslint:disable-next-line:no-shadowed-variable
	const handleGenerateAddress = (wallet: { address: string; type: string; currency: string }) => {
		if (!wallet.address && wallets.length && wallet.type !== 'fiat') {
			dispatch(walletsAddressFetch({ currency: wallet.currency }));
			dispatch(walletsFetch());
			setGenerateAddressTriggered(true);
		}
	};

	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency }));
	}, [currency, dispatch]);

	// tslint:disable-next-line:no-shadowed-variable
	const changeSelectTab = (currency: string) => {
		dispatch(walletsAddressFetch({ currency }));
		// tslint:disable-next-line:no-shadowed-variable
		const parentWallet = wallets.find(item => item.currency.toLowerCase() === currency.toLowerCase());
		if (parentWallet) {
			setSelectedWallet({
				name: parentWallet.name,
				address: parentWallet.address,
				balance: parentWallet.balance,
				currency: parentWallet.currency,
				type: parentWallet.type,
			});
		}
		// tslint:disable-next-line:no-shadowed-variable
		const childWallet = childWallets.find(childWallet => childWallet.currency.toLowerCase() === currency.toLowerCase());
		if (childWallet) {
			setSelectedWallet({
				name: childWallet.name,
				address: childWallet.address,
				balance: childWallet.balance,
				currency: childWallet.currency,
				type: childWallet.type,
			});
		}
	};

	const renderParentCurrencyTab = () => {
		if (!parentWallet.currency) {
			return '';
		}

		return (
			<TabPane tab={getTabName(currencyItem.blockchain_key || '')} key={currency}>
				<WalletDepositBody
					wallet_index={0}
					wallet={parentWallet}
					isAccountActivated={isParentAccountActivated}
					handleGenerateAddress={() =>
						handleGenerateAddress({
							address: parentWallet.address || '',
							type: parentWallet.type || '',
							currency: parentWallet.currency || '',
						})
					}
					generateAddressTriggered={generateAddressTriggered}
				/>
			</TabPane>
		);
	};

	const renderChildCurrencyTabs = () => {
		if (childWallets.length <= 0) {
			return '';
		}

		return childWallets.map((childWallet, index) => (
			<TabPane tab={getTabName(childWallet.blockchain_key || '')} key={childWallet.currency || ''}>
				<div style={{ position: 'relative', width: '100%', height: '100%' }}>
					<WalletDepositBody
						wallet_index={index + 1}
						wallet={childWallet}
						isAccountActivated={isChildAccountActivated}
						handleGenerateAddress={() =>
							handleGenerateAddress({
								address: childWallet.address || '',
								type: childWallet.type || '',
								currency: childWallet.currency || '',
							})
						}
						generateAddressTriggered={generateAddressTriggered}
					/>
				</div>
			</TabPane>
		));
	};

	return (
		<div id="wallet-deposit">
			<Subheader
				title={intl.formatMessage({ id: 'page.body.wallets.tabs.deposit' })}
				backTitle={intl.formatMessage({ id: 'page.body.wallets.balance' })}
				onGoBack={() => history.push(`/wallets/${currency}/history`)}
			/>
			<WalletHeader
				currency={selectedWallet.currency !== '' ? selectedWallet.currency : parentWallet.currency}
				name={selectedWallet.name !== '' ? selectedWallet.name : parentWallet.name}
			/>
			<WalletBanner wallet={selectedWallet.currency !== '' ? selectedWallet : parentWallet} />
			<div className="react-tabs">
				<Tabs defaultActiveKey={currency} onChange={changeSelectTab}>
					{renderParentCurrencyTab()}
					{renderChildCurrencyTabs()}
				</Tabs>
			</div>
		</div>
	);
};

export { WalletDeposit };
