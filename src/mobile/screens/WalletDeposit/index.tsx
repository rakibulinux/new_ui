import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import {
	selectChildCurrencies,
	selectWallets,
	walletsAddressFetch,
	walletsChildCurrenciesFetch,
	walletsFetch,
} from '../../../modules/user/wallets';
import { Subheader, WalletDepositBody, WalletHeader, WalletBanner } from '../../components';
import Tabs, { TabPane } from 'rc-tabs';
import { getTabName } from '../../../helpers';
import { selectCurrencies } from '../../../modules';

const WalletDeposit: React.FC = () => {
	const [generateAddressTriggered, setGenerateAddressTriggered] = React.useState(false);
	const dispatch = useDispatch();
	const intl = useIntl();
	const history = useHistory();
	const { currency = '' } = useParams<{ currency: string }>();
	const wallets = useSelector(selectWallets) || [];
	const currencies = useSelector(selectCurrencies);
	const currencyItem = currencies.find(cur => cur.id === currency.toLowerCase()) || { blockchain_key: '' };
	const wallet = wallets.find(item => item.currency === currency) || {
		name: '',
		currency: '',
		balance: '',
		type: '',
		address: '',
	};
	const isAccountActivated = wallet.type === 'fiat' || wallet.balance;
	const dispatchFetchChildCurrencies = () => dispatch(walletsChildCurrenciesFetch({ currency: currency }));
	const child_currencies = useSelector(selectChildCurrencies);
	React.useEffect(() => {
		dispatchFetchChildCurrencies();
	}, [currency]);

	const child_wallets = child_currencies.map(network => {
		return {
			...network,
			wallet: wallets.find(item => item.currency === network.id) || {
				name: '',
				currency: '',
				balance: '',
				type: '',
				address: '',
			},
		};
	});

	const handleGenerateAddress = (wallet: { address: string; type: string; currency: string }) => {
		if (!wallet.address && wallets.length && wallet.type !== 'fiat') {
			dispatch(walletsAddressFetch({ currency: wallet.currency }));
			dispatch(walletsFetch());
			setGenerateAddressTriggered(true);
		}
	};

	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency }));
	}, [dispatch, currency]);

	return (
		<div id="wallet-deposit">
			<Subheader
				title={intl.formatMessage({ id: 'page.body.wallets.tabs.deposit' })}
				backTitle={intl.formatMessage({ id: 'page.body.wallets.balance' })}
				onGoBack={() => history.push(`/wallets/${currency}/history`)}
			/>
			<WalletHeader currency={wallet.currency} name={wallet.name} />
			<WalletBanner wallet={wallet} />
			<div className="react-tabs">
				<Tabs defaultActiveKey={currency}>
					{wallet ? (
						<TabPane tab={getTabName(currencyItem.blockchain_key || '')} key={currency}>
							<WalletDepositBody
								wallet_index={0}
								wallet={wallet}
								isAccountActivated={isAccountActivated}
								handleGenerateAddress={() =>
									handleGenerateAddress({
										address: wallet.address || '',
										type: wallet.type || '',
										currency: wallet.currency || '',
									})
								}
								generateAddressTriggered={generateAddressTriggered}
							/>
						</TabPane>
					) : (
						''
					)}
					{child_wallets
						? child_wallets.map((child_wallet, index) => (
								<TabPane tab={getTabName(child_wallet.blockchain_key || '')} key={child_wallet.id || ''}>
									<div style={{ position: 'relative', width: '100%', height: '100%' }}>
										{child_wallet.wallet && child_wallet.deposit_enabled ? (
											<WalletDepositBody
												wallet_index={index + 1}
												wallet={child_wallet.wallet}
												isAccountActivated={isAccountActivated}
												handleGenerateAddress={() =>
													handleGenerateAddress({
														address: child_wallet.wallet.address || '',
														type: child_wallet.wallet.type || '',
														currency: child_wallet.wallet.currency || '',
													})
												}
												generateAddressTriggered={generateAddressTriggered}
											/>
										) : (
											''
										)}
									</div>
								</TabPane>
						  ))
						: ''}
				</Tabs>
			</div>
		</div>
	);
};

export { WalletDeposit };
