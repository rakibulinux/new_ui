import Tabs, { TabPane } from 'rc-tabs';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useIntl } from 'react-intl';
import { LockIcon } from '../../assets/images/LockIcon';
import { DepositBody } from '../../components';
import { getTabName } from '../../helpers';
import { ChildCurrency, selectCurrencies, selectWallets, walletsAddressFetch, walletsFetch } from '../../modules';

interface DepositAddressProps {
	currency_id: string;
	currency_icon: string;
	child_currencies: ChildCurrency[];
	changeCurrency: (currencyId: string) => void;
}

export const DepositAddress: React.FC<DepositAddressProps> = (props: DepositAddressProps) => {
	const { currency_id, child_currencies, changeCurrency } = props;
	const intl = useIntl();
	const [generateAddressTriggered, setGenerateAddressTriggered] = React.useState(false);
	const dispatch = useDispatch();
	const wallets = useSelector(selectWallets) || [];
	const currencies = useSelector(selectCurrencies) || [];
	const currency = currencies.find(cur => cur.id.toLowerCase() === currency_id.toLowerCase()) || { blockchain_key: '' };
	const mainWallet = wallets.find(item => item.currency === currency_id.toLowerCase()) || {
		name: '',
		currency: '',
		balance: '',
		type: '',
		address: '',
	};
	const childWallets = child_currencies.map(network => {
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
	const isAccountActivated = mainWallet.type === 'fiat' || mainWallet.balance;

	const handleGenerateAddress = (wallet: { address: string; type: string; currency: string }) => {
		if (!wallet.address && wallets.length && wallet.type !== 'fiat') {
			dispatch(walletsAddressFetch({ currency: wallet.currency }));
			dispatch(walletsFetch());
			setGenerateAddressTriggered(true);
		}
	};

	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency: currency_id }));
	}, [currency_id]);

	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency: currency_id }));
	}, [dispatch, currency_id]);

	return (
		<div id="deposit-address">
			<div
				className="container d-flex flex-column justify-content-between"
				style={{ backgroundColor: '#2D2E3D', padding: '30px', borderRadius: '5px', height: '100%', fontSize: '1.3rem' }}
			>
				<div>
					<div className="row">
						<div className="col-12 d-flex justify-content-between">
							<h4>Deposit Network</h4>
							<span>Average arrival time：1 minutes</span>
						</div>
					</div>
					<div className="row">
						<div className="col-12">
							<div className="react-tabs">
								<Tabs defaultActiveKey={currency_id} onChange={changeCurrency}>
									{mainWallet ? (
										<TabPane tab={getTabName(currency.blockchain_key || '')} key={currency_id}>
											<DepositBody
												wallet_index={0}
												wallet={mainWallet}
												isAccountActivated={isAccountActivated}
												handleGenerateAddress={() =>
													handleGenerateAddress({
														address: mainWallet.address || '',
														type: mainWallet.type || '',
														currency: mainWallet.currency || '',
													})
												}
												generateAddressTriggered={generateAddressTriggered}
											/>
										</TabPane>
									) : (
										''
									)}
									{childWallets
										? childWallets.map((childWallet, index) => (
												<TabPane
													tab={getTabName(childWallet.blockchain_key || '')}
													key={childWallet.id || ''}
												>
													<div style={{ position: 'relative', width: '100%', height: '100%' }}>
														{childWallet.wallet && childWallet.deposit_enabled ? (
															<DepositBody
																wallet_index={index + 1}
																wallet={childWallet.wallet}
																isAccountActivated={isAccountActivated}
																handleGenerateAddress={() =>
																	handleGenerateAddress({
																		address: childWallet.wallet.address || '',
																		type: childWallet.wallet.type || '',
																		currency: childWallet.wallet.currency || '',
																	})
																}
																generateAddressTriggered={generateAddressTriggered}
															/>
														) : (
															<div className="blur-disabled">
																<LockIcon className="pg-blur__content__icon" />
																{intl.formatMessage({
																	id: 'page.body.wallets.tabs.deposit.disabled.message',
																})}
															</div>
														)}
													</div>
												</TabPane>
										  ))
										: ''}
								</Tabs>
							</div>
						</div>
					</div>
				</div>
				<div className="row mt-5">
					<div className="col-12 d-flex justify-content-between">
						<p className="pr-5">
							<strong>Send only {currency_id.toUpperCase()} to this deposit address.</strong>
							<br />
							Sending coin or token other than {currency_id.toUpperCase()} to this address may result in the loss of
							your deposit.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
