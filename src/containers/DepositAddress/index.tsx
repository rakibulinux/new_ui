import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs, { TabPane } from 'rc-tabs';

import { useIntl } from 'react-intl';
import { LockIcon } from '../../assets/images/LockIcon';
import { getTabName } from '../../helpers';
import { ChildCurrency, selectWallets, selectCurrencies, walletsAddressFetch, walletsFetch } from '../../modules';
import { DepositBody } from '../../components';

interface DepositAddressProps {
	currency_id: string;
	currency_icon: string;
	child_currencies: ChildCurrency[];
}

export const DepositAddress: React.FC<DepositAddressProps> = (props: DepositAddressProps) => {
	const { currency_id, child_currencies } = props;
	const intl = useIntl();
	const [generateAddressTriggered, setGenerateAddressTriggered] = React.useState(false);
	const [selectedCurrencyID, setSelectedCurrencyID] = React.useState(currency_id);
	const dispatch = useDispatch();
	const wallets = useSelector(selectWallets) || [];
	const currencies = useSelector(selectCurrencies) || [];
	const currency = currencies.find(cur => cur.id.toLowerCase() === currency_id.toLowerCase()) || { blockchain_key: '' };
	const main_wallet = wallets.find(item => item.currency === currency_id) || {
		name: '',
		currency: '',
		balance: '',
		type: '',
		address: '',
	};
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
	const isAccountActivated = main_wallet.type === 'fiat' || main_wallet.balance;

	const handleGenerateAddress = (wallet: { address: string; type: string; currency: string }) => {
		if (!wallet.address && wallets.length && wallet.type !== 'fiat') {
			dispatch(walletsAddressFetch({ currency: wallet.currency }));
			dispatch(walletsFetch());
			setGenerateAddressTriggered(true);
		}
	};

	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency: selectedCurrencyID }));
	}, [selectedCurrencyID]);

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
							<h4>Deposit Nework</h4>
							<span>Average arrival time：1 minutes</span>
						</div>
					</div>
					<div className="row">
						<div className="col-12">
							<div className="react-tabs">
								<Tabs defaultActiveKey={currency_id} onChange={key => setSelectedCurrencyID(key)}>
									{main_wallet ? (
										<TabPane tab={getTabName(currency.blockchain_key || '')} key={currency_id}>
											<DepositBody
												wallet_index={0}
												wallet={main_wallet}
												isAccountActivated={isAccountActivated}
												handleGenerateAddress={() =>
													handleGenerateAddress({
														address: main_wallet.address || '',
														type: main_wallet.type || '',
														currency: main_wallet.currency || '',
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
												<TabPane
													tab={getTabName(child_wallet.blockchain_key || '')}
													key={child_wallet.id || ''}
												>
													<div style={{ position: 'relative', width: '100%', height: '100%' }}>
														{child_wallet.wallet && child_wallet.deposit_enabled ? (
															<DepositBody
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
							<strong>Send only {selectedCurrencyID.toUpperCase()} to this deposit address.</strong>
							<br />
							Sending coin or token other than {selectedCurrencyID.toUpperCase()} to this address may result in the
							loss of your deposit.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
