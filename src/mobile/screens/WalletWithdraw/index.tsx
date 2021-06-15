import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { useWalletsFetch } from '../../../hooks';
import { selectChildCurrencies, selectWallets, walletsChildCurrenciesFetch } from '../../../modules/user/wallets';
import { Subheader, WalletHeader, WalletWithdrawBody, WalletBanner } from '../../components';
import Tabs, { TabPane } from 'rc-tabs';
import { selectCurrencies } from '../../../modules';
import { LockIcon } from '../../../assets/images/LockIcon';
import { getTabName } from '../../../helpers';

const defaultWallet = { name: '', currency: '', balance: '', type: '', address: '', fee: '' };

const WalletWithdraw: React.FC = () => {
	const { currency = '' } = useParams<{ currency: string }>();
	const [currencyState, setCurrencyState] = React.useState(currency);

	const intl = useIntl();
	const history = useHistory();
	const wallets = useSelector(selectWallets) || [];
	const wallet = wallets.find(item => item.currency === currency) || defaultWallet;
	const parent_currencies = useSelector(selectCurrencies);
	const parent_currency = parent_currencies.find(par_cur => par_cur.id.toLowerCase() === String(currency).toLowerCase()) || {
		blockchain_key: '',
		withdrawal_enabled: false,
	};
	const child_currencies = useSelector(selectChildCurrencies);
	const dispatch = useDispatch();
	const dispatchFetchChildCurrencies = React.useCallback(() => dispatch(walletsChildCurrenciesFetch({ currency: currency })), [
		currency,
		dispatch,
	]);
	// side effects
	React.useEffect(() => {
		dispatchFetchChildCurrencies();
		setCurrencyState(currency);
	}, [currency, dispatchFetchChildCurrencies]);
	useWalletsFetch();

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

	return (
		<div id="wallet-withdraw" className="cr-mobile-wallet-withdraw">
			<Subheader
				title={intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw' })}
				backTitle={intl.formatMessage({ id: 'page.body.wallets.balance' })}
				onGoBack={() => history.push(`/wallets/${currency}/history`)}
			/>
			<WalletHeader currency={wallet.currency} name={wallet.name} />
			<WalletBanner wallet={wallet} />

			<div className="react-tabs">
				<Tabs defaultActiveKey={currency} onTabClick={key => setCurrencyState(key)}>
					{wallet ? (
						<TabPane tab={getTabName(parent_currency.blockchain_key || '')} key={currency}>
							{parent_currency && parent_currency.withdrawal_enabled ? (
								<WalletWithdrawBody parent_currency={currency} currency={currencyState} wallet={wallet} />
							) : (
								<div style={{ position: 'relative', width: '100%', height: '300px' }}>
									<div className="blur-disabled">
										<LockIcon className="pg-blur__content__icon" />
										{intl.formatMessage({
											id: 'page.body.wallets.tabs.withdraw.disabled.message',
										})}
									</div>
								</div>
							)}
						</TabPane>
					) : (
						''
					)}
					{child_wallets
						? child_wallets.map(child_wallet => (
								<TabPane tab={getTabName(child_wallet.blockchain_key)} key={child_wallet.id}>
									{child_wallet.wallet && child_wallet.withdrawal_enabled ? (
										<WalletWithdrawBody
											parent_currency={currency}
											currency={currencyState}
											wallet={child_wallet.wallet}
										/>
									) : (
										<div style={{ position: 'relative', width: '100%', height: '300px' }}>
											<div className="blur-disabled">
												<LockIcon className="pg-blur__content__icon" />
												{intl.formatMessage({
													id: 'page.body.wallets.tabs.withdraw.disabled.message',
												})}
											</div>
										</div>
									)}
								</TabPane>
						  ))
						: ''}
				</Tabs>
			</div>
		</div>
	);
};

export { WalletWithdraw };
