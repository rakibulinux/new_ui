import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Tabs, { TabPane } from 'rc-tabs';
import { useIntl } from 'react-intl';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { message } from 'antd';
import { User } from '@sentry/browser';
import { WithdrawProps, Withdraw, ModalWithdrawSubmit, ModalWithdrawConfirmation } from '..';
import { LockIcon } from '../../assets/images/LockIcon';
import { WalletItemProps } from '../../components';
import { getTabName } from '../../helpers';
import { useEthFeeFetch } from '../../hooks';
import {
	Wallet,
	Currency,
	ETHFee,
	ChildCurrency,
	Beneficiary,
	selectETHFee,
	walletsAddressFetch,
	walletsWithdrawCcyFetch,
} from '../../modules';

interface WithdrawAddressProps {
	currency_id: string;
	wallets: Wallet[];
	currencies: Currency[];
	user: User;
	ethFee: ETHFee[];
	childCurrencies: ChildCurrency[];
}

const defaultBeneficiary: Beneficiary = {
	id: 0,
	currency: '',
	name: '',
	state: '',
	data: {
		address: '',
	},
};

interface WalletsState {
	otpCode: string;
	amount: string;
	beneficiary: Beneficiary;
	withdrawSubmitModal: boolean;
	withdrawConfirmModal: boolean;
	bchAddress?: string;
	filteredWallets?: WalletItemProps[] | null;
	tab: string;
	withdrawDone: boolean;
	total: string;
	currentTabIndex: number;
	generateAddressTriggered: boolean;
}

export const WithdrawAddress: React.FC<WithdrawAddressProps> = (props: WithdrawAddressProps) => {
	const { currency_id, wallets, currencies, childCurrencies } = props;

	const [currencyState, setCurrencyState] = React.useState(currency_id);

	React.useEffect(() => {
		setCurrencyState(currency_id);
	}, [currency_id]);

	useEthFeeFetch();

	const intl = useIntl();
	const dispatch = useDispatch();
	const history = useHistory();

	// selectors
	const ethFees = useSelector(selectETHFee);

	// state
	const [withdrawState, setState] = React.useState<WalletsState>({
		withdrawSubmitModal: false,
		withdrawConfirmModal: false,
		otpCode: '',
		amount: '',
		beneficiary: defaultBeneficiary,
		tab: intl.formatMessage({ id: 'page.body.wallets.tabs.deposit' }),
		withdrawDone: false,
		total: '',
		currentTabIndex: 0,
		generateAddressTriggered: false,
	});

	// side effects
	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency: currency_id }));
	}, [dispatch, currency_id]);

	const childWallets = childCurrencies.map(childCurrency => {
		return {
			...childCurrency,
			wallet: wallets.find(item => item.currency === childCurrency.id) || {
				name: '',
				currency: '',
				balance: '',
				type: 'coin',
				address: '',
				fee: 0,
				explorerTransaction: '',
				explorerAddress: '',
				fixed: 0,
			},
		};
	});

	const wallet = wallets.find(item => item.currency === currency_id.toLowerCase()) || {
		name: '',
		currency: '',
		balance: '',
		type: 'coin',
		address: '',
		fee: 0,
		explorerTransaction: '',
		explorerAddress: '',
		fixed: 0,
	};
	const selectedWallet = wallets.find(item => item.currency === currencyState.toLowerCase()) || {
		name: '',
		currency: '',
		balance: '',
		type: 'coin',
		address: '',
		fee: 0,
		explorerTransaction: '',
		explorerAddress: '',
		fixed: 0,
	};
	const currencyItem = currencies.find(currency => currency.id.toLowerCase() === currency_id.toLowerCase()) || {
		blockchain_key: '',
		withdrawal_enabled: false,
	};
	const currencyFee = ethFees.find(cur => cur.currency_id === currency_id);
	const ethFee = currencyFee ? currencyFee.fee : undefined;
	const selectedWalletFee = selectedWallet ? selectedWallet.fee : wallet.fee;
	const ethWallet = wallets.find(wallet => wallet.currency.toLowerCase() === 'eth');
	const ethBallance = ethWallet ? ethWallet.balance : undefined;
	let confirmationAddress = '';
	if (wallet) {
		confirmationAddress =
			wallet.type === 'fiat'
				? withdrawState.beneficiary.name
				: withdrawState.beneficiary.data
				? (withdrawState.beneficiary.data.address as string)
				: '';
	}

	const redirectToEnable2fa = () => history.push('/security/2fa', { enable2fa: true });

	const toggleConfirmModal = (amount?: string, total?: string, beneficiary?: Beneficiary, otpCode?: string) => {
		setState({
			...withdrawState,
			amount: amount || '',
			beneficiary: beneficiary ? beneficiary : defaultBeneficiary,
			otpCode: otpCode ? otpCode : '',
			withdrawConfirmModal: !withdrawState.withdrawConfirmModal,
			total: total || '',
			withdrawDone: false,
		});
	};

	const isOtpDisabled = () => {
		return (
			<React.Fragment>
				<p className="pg-wallet__enable-2fa-message">
					{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.enable2fa' })}
				</p>
				<Button block={true} onClick={redirectToEnable2fa} size="lg" variant="primary">
					{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.enable2faButton' })}
				</Button>
			</React.Fragment>
		);
	};

	const isTwoFactorAuthRequired = (level: number, is2faEnabled: boolean) => {
		return level > 1 || (level === 1 && is2faEnabled);
	};

	const renderWithdrawContent = (wallet: Wallet) => {
		const {
			user: { level, otp },
			currencies,
		} = props;

		const { currency, type, fee } = wallet;

		const fixed = (wallet || { fixed: 0 }).fixed;

		const selectedCurrency = currencies.find(cur => cur.id == currency);
		const minWithdrawAmount =
			selectedCurrency && selectedCurrency.min_withdraw_amount ? selectedCurrency.min_withdraw_amount : undefined;
		const parentCurrency = currencies.find(currency => currency.id === currency_id);
		const limitWitdraw24h = parentCurrency ? parentCurrency.withdraw_limit_24h : undefined;

		const withdrawProps: WithdrawProps = {
			withdrawDone: withdrawState.withdrawDone,
			currency: currencyState,
			fee: fee,
			onClick: toggleConfirmModal,
			twoFactorAuthRequired: isTwoFactorAuthRequired(level, otp),
			fixed,
			type,
			withdrawAmountLabel: intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amount' }),
			withdraw2faLabel: intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' }),
			withdrawFeeLabel: intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' }),
			withdrawTotalLabel: intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' }),
			withdrawButtonLabel: intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' }),
			ethFee,
			ethBallance: ethBallance,
			minWithdrawAmount,
			limitWitdraw24h,
			limitWitdraw24hLabel: currency_id.toUpperCase(),
		};

		return otp ? <Withdraw {...withdrawProps} /> : isOtpDisabled();
	};

	const toggleSubmitModal = () => {
		setState({
			...withdrawState,
			withdrawSubmitModal: !withdrawState.withdrawSubmitModal,
			withdrawDone: true,
		});
	};

	const handleWithdraw = () => {
		const { otpCode, amount, beneficiary } = withdrawState;
		if (!wallet) {
			return;
		}
		const { currency, fee } = selectedWallet ? selectedWallet : wallet;

		// Withdraw by eth fee
		const { user, ethFee: eth_fee, wallets } = props;
		const ethWallet = wallets.find(wallet => wallet.currency.toLowerCase() === 'eth');
		const ethBallance = ethWallet ? ethWallet.balance : undefined;
		const currencyFee = eth_fee.find(cur => cur.currency_id === currency);

		if (fee == 0) {
			if (!(currencyFee && currencyFee.fee)) {
				message.error('Something wrong with ETH fee.');
				return;
			}
			if (!(ethBallance && Number(ethBallance) >= Number(currencyFee.fee))) {
				message.error("ETH balance isn't enough to pay.");
				return;
			}
		}

		const withdrawRequest = {
			uid: user.uid,
			fee: fee.toString(),
			amount,
			currency: currencyState,
			otp: otpCode,
			beneficiary_id: String(beneficiary.id),
		};

		dispatch(walletsWithdrawCcyFetch(withdrawRequest));
		toggleConfirmModal();
	};

	return (
		<div id="withdraw-address">
			<div
				className="container d-flex flex-column justify-content-between"
				style={{ backgroundColor: '#2D2E3D', padding: '30px', borderRadius: '5px', height: '100%', fontSize: '1.3rem' }}
			>
				<div>
					<div className="row">
						<div className="col-12">
							<h4>Withdrawal Network</h4>
						</div>
					</div>
					<div className="row">
						<div className="col-12">
							{
								<div className="react-tabs">
									<Tabs defaultActiveKey={currency_id} onTabClick={setCurrencyState}>
										{wallet ? (
											<TabPane tab={getTabName(currencyItem.blockchain_key || '')} key={currency_id}>
												{currencyItem && !currencyItem.withdrawal_enabled ? (
													<div style={{ position: 'relative', width: '100%', height: '300px' }}>
														<div className="blur-disabled">
															<LockIcon className="pg-blur__content__icon" />
															{intl.formatMessage({
																id: 'page.body.wallets.tabs.withdraw.disabled.message',
															})}
														</div>
													</div>
												) : (
													renderWithdrawContent(wallet)
												)}
											</TabPane>
										) : (
											''
										)}

										{childWallets
											? childWallets.map(childWallet => (
													<TabPane tab={getTabName(childWallet.blockchain_key)} key={childWallet.id}>
														{childWallet.wallet && childWallet.withdrawal_enabled ? (
															renderWithdrawContent(childWallet.wallet)
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
							}
						</div>
					</div>
				</div>
			</div>
			<ModalWithdrawSubmit show={withdrawState.withdrawSubmitModal} currency={currency_id} onSubmit={toggleSubmitModal} />
			<ModalWithdrawConfirmation
				show={withdrawState.withdrawConfirmModal}
				amount={withdrawState.total}
				currency={currencyState}
				rid={confirmationAddress}
				onSubmit={handleWithdraw}
				onDismiss={toggleConfirmModal}
				selectedWalletFee={selectedWalletFee}
				ethFee={ethFee}
				ethBallance={ethBallance}
			/>
		</div>
	);
};
