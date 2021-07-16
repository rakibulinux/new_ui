import { message } from 'antd';
import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Blur } from '../../../components/Blur';
import { ModalWithdrawSubmit } from '../../../containers';
import { WithdrawComponent } from '../../containers';
import { useBeneficiariesFetch, useCurrenciesFetch, useWalletsAddressFetch } from '../../../hooks';
import { ethFeeFetch, selectETHFee } from '../../../modules';
import { selectCurrencies } from '../../../modules/public/currencies';
import { Beneficiary } from '../../../modules/user/beneficiaries';
import { selectUserInfo } from '../../../modules/user/profile';
import {
	selectChildCurrencies,
	selectWallets,
	selectWithdrawSuccess,
	walletsWithdrawCcyFetch,
} from '../../../modules/user/wallets';
import { ModalWithdrawConfirm } from '../ModalWithdrawConfirm';

const defaultBeneficiary: Beneficiary = {
	id: 0,
	currency: '',
	name: '',
	state: '',
	data: {
		address: '',
	},
};

const WalletWithdrawBodyComponent = props => {
	const [withdrawSubmitModal, setWithdrawSubmitModal] = React.useState(false);
	const [withdrawData, setWithdrawData] = React.useState({
		amount: '',
		beneficiary: defaultBeneficiary,
		otpCode: '',
		withdrawConfirmModal: false,
		total: '',
		withdrawDone: false,
	});

	const intl = useIntl();
	const dispatch = useDispatch();
	const user = useSelector(selectUserInfo);
	const wallets = useSelector(selectWallets);
	const currencies = useSelector(selectCurrencies);

	const withdrawSuccess = useSelector(selectWithdrawSuccess);
	const { currency, fee, type } = props.wallet;
	const fixed = (props.wallet || { fixed: 0 }).fixed;
	const withdrawAmountLabel = React.useMemo(
		() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amount' }),
		[intl],
	);
	const withdraw2faLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' }), [
		intl,
	]);
	const withdrawFeeLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' }), [
		intl,
	]);
	const withdrawTotalLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' }), [
		intl,
	]);
	const withdrawButtonLabel = React.useMemo(
		() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' }),
		[intl],
	);
	const currencyItem = (currencies && currencies.find(item => item.id === currency)) || {
		id: '',
		withdraw_limit_24h: undefined,
		min_withdraw_amount: undefined,
		withdrawal_enabled: false,
	};

	const ethFee = useSelector(selectETHFee);
	React.useEffect(() => {
		dispatch(ethFeeFetch());
	}, [dispatch]);

	const isTwoFactorAuthRequired = (level: number, is2faEnabled: boolean) => {
		return level > 1 || (level === 1 && is2faEnabled);
	};
	const getConfirmationAddress = () => {
		let confirmationAddress = '';

		if (props.wallet) {
			confirmationAddress =
				props.wallet.type === 'fiat'
					? withdrawData.beneficiary.name
					: withdrawData.beneficiary.data
					? (withdrawData.beneficiary.data.address as string)
					: '';
		}

		return confirmationAddress;
	};
	const toggleConfirmModal = (amount?: string, total?: string, beneficiary?: Beneficiary, otpCode?: string) => {
		setWithdrawData((state: any) => ({
			amount: amount || '',
			beneficiary: beneficiary || defaultBeneficiary,
			otpCode: otpCode || '',
			withdrawConfirmModal: !state.withdrawConfirmModal,
			total: total || '',
			withdrawDone: false,
		}));
	};
	const toggleSubmitModal = () => {
		setWithdrawSubmitModal(state => !state);
		setWithdrawData(state => ({ ...state, withdrawDone: true }));
	};
	const handleWithdraw = () => {
		const { otpCode, amount, beneficiary } = withdrawData;
		if (!props.wallet) {
			return;
		}

		if (+fee === 0) {
			if (!(feeCurrency && feeCurrency.fee)) {
				message.error('Something wrong with ETH fee.');

				return;
			}
			if (!(ethBallance && Number(ethBallance) >= Number(feeCurrency.fee))) {
				message.error('ETH balance isn`\t enough to pay.');

				return;
			}
		}
		const withdrawRequest = {
			uid: user.uid,
			fee: fee,
			amount,
			currency: currency.toLowerCase(),
			otp: otpCode,
			beneficiary_id: String(beneficiary.id),
		};
		dispatch(walletsWithdrawCcyFetch(withdrawRequest));
		toggleConfirmModal();
	};

	React.useEffect(() => {
		if (withdrawSuccess) {
			toggleSubmitModal();
		}
	}, [withdrawSuccess]);

	useWalletsAddressFetch(currency);
	useBeneficiariesFetch();
	useCurrenciesFetch();

	const minWithdrawAmount = currencyItem && currencyItem.min_withdraw_amount ? currencyItem.min_withdraw_amount : undefined;

	const className = classnames('td-mobile-wallet-withdraw-body', {
		'td-mobile-wallet-withdraw-body--disabled': currencyItem && !currencyItem.withdrawal_enabled,
	});

	const ethWallet = wallets.find(wallet => wallet.currency.toLowerCase() === 'eth');
	const ethBallance = ethWallet ? ethWallet.balance : undefined;
	const selectedWallet = wallets.find(wallet => wallet.currency.toLowerCase() === currency.toLowerCase());
	const selectedWalletFee = selectedWallet ? selectedWallet.fee : undefined;

	const feeCurrency = ethFee.find(cur => cur.currency_id === currency);
	const childCurrencies = useSelector(selectChildCurrencies);
	const childCurrency = childCurrencies.find(child => child.id === currency) || { parent_id: '' };
	const parentCurrencyId = childCurrency.parent_id;
	const parentCurrency = currencies.find(cur => cur.id === parentCurrencyId) || { id: '', withdraw_limit_24h: undefined };
	const limitWitdraw24h = parentCurrency ? parentCurrency.withdraw_limit_24h : undefined;

	const parentWalletBalance = wallets.find(wallet => wallet.currency === props.parent_currency);

	return (
		<div className={className}>
			<WithdrawComponent
				isMobileDevice
				ethFee={feeCurrency ? feeCurrency.fee : undefined}
				fee={fee}
				ethBallance={ethBallance}
				minWithdrawAmount={minWithdrawAmount}
				type={type}
				fixed={fixed}
				currency={currency}
				onClick={toggleConfirmModal}
				withdrawAmountLabel={withdrawAmountLabel}
				withdraw2faLabel={withdraw2faLabel}
				withdrawFeeLabel={withdrawFeeLabel}
				withdrawTotalLabel={withdrawTotalLabel}
				withdrawDone={withdrawData.withdrawDone}
				withdrawButtonLabel={withdrawButtonLabel}
				twoFactorAuthRequired={isTwoFactorAuthRequired(user.level, user.otp)}
				limitWitdraw24h={currencyItem.withdraw_limit_24h ? currencyItem.withdraw_limit_24h : limitWitdraw24h}
				limitWitdraw24hLabel={parentCurrencyId ? parentCurrencyId.toUpperCase() : currencyItem.id.toUpperCase()}
				parentWalletBalance={parentWalletBalance?.balance}
				parentCurrency={props.parent_currency}
			/>
			<div hidden={currencyItem.withdrawal_enabled} className="withdraw-disabled">
				<Blur text={intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.disabled.message' })} />
			</div>

			<div className="td-mobile-wallet-withdraw-body__submit">
				<ModalWithdrawSubmit isMobileDevice show={withdrawSubmitModal} currency={currency} onSubmit={toggleSubmitModal} />
			</div>
			<div className="td-mobile-wallet-withdraw-body__confirmation">
				<ModalWithdrawConfirm
					ethBallance={ethBallance}
					selectedWalletFee={selectedWalletFee}
					ethFee={feeCurrency ? feeCurrency.fee : undefined}
					isMobileDevice
					show={withdrawData.withdrawConfirmModal}
					amount={withdrawData.total}
					currency={currency}
					rid={getConfirmationAddress()}
					onSubmit={handleWithdraw}
					onDismiss={toggleConfirmModal}
				/>
			</div>
		</div>
	);
};

const WalletWithdrawBody = React.memo(WalletWithdrawBodyComponent);

export { WalletWithdrawBody };
