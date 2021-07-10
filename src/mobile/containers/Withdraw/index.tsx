import { Modal } from 'antd';
import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { Decimal } from '../../components/Decimal';
import { FormControl, InputGroup } from 'react-bootstrap';

import { FrownOutlined } from '@ant-design/icons';
import { Beneficiaries, SummaryField } from 'mobile/components';
import { cleanPositiveFloatInput, precisionRegExp } from 'helpers';
import { alertPush, Beneficiary } from 'modules';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
export interface WithdrawProps {
	currency: string;
	fee: number;
	onClick: (amount: string, total: string, beneficiary: Beneficiary, otpCode: string) => void;
	fixed: number;
	className?: string;
	type: 'fiat' | 'coin';
	twoFactorAuthRequired?: boolean;
	withdrawAmountLabel?: string;
	withdraw2faLabel?: string;
	withdrawFeeLabel?: string;
	withdrawTotalLabel?: string;
	withdrawButtonLabel?: string;
	withdrawDone: boolean;
	isMobileDevice?: boolean;
	ethFee: number | undefined;
	ethBallance?: string;
	minWithdrawAmount?: string;
	limitWitdraw24h?: string;
	limitWitdraw24hLabel?: string;
	parentWalletBalance?: string;
	parentCurrency: string;
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

interface WithdrawState {
	amount: string;
	beneficiary: Beneficiary;
	otpCode: string;
	withdrawAmountFocused: boolean;
	withdrawCodeFocused: boolean;
	total: string;
}

interface DispatchProps {
	pushAlert: typeof alertPush;
}

class Withdraw extends React.Component<DispatchProps & WithdrawProps, WithdrawState> {
	public state = {
		amount: '',
		beneficiary: defaultBeneficiary,
		otpCode: '',
		withdrawAmountFocused: false,
		withdrawCodeFocused: false,
		total: '',
	};

	public componentWillReceiveProps(nextProps) {
		const { currency, withdrawDone } = this.props;
		if (
			(nextProps && JSON.stringify(nextProps.currency) !== JSON.stringify(currency)) ||
			(nextProps.withdrawDone && !withdrawDone)
		) {
			this.setState({
				amount: '',
				otpCode: '',
				total: '',
			});
		}
	}

	public render() {
		const { amount, withdrawAmountFocused } = this.state;
		const {
			className,
			currency,
			type,
			twoFactorAuthRequired,
			withdrawAmountLabel,
			withdrawFeeLabel,
			withdrawTotalLabel,
			withdrawButtonLabel,
			isMobileDevice,
		} = this.props;

		const cx = classnames('cr-withdraw', className);
		const lastDividerClassName = classnames('cr-withdraw__divider', {
			'cr-withdraw__divider-one': twoFactorAuthRequired,
			'cr-withdraw__divider-two': !twoFactorAuthRequired,
		});

		const withdrawAmountClass = classnames('cr-withdraw__group__amount', {
			'cr-withdraw__group__amount--focused': withdrawAmountFocused,
		});

		return (
			<div className={cx}>
				<div className="cr-withdraw-column">
					<div className="cr-withdraw__group__address">
						<Beneficiaries currency={currency} type={type} onChangeValue={this.handleChangeBeneficiary} />
					</div>
					<div className="cr-withdraw__divider cr-withdraw__divider-one" />
					<div className={withdrawAmountClass} style={{ position: 'relative', marginTop: '1rem' }}>
						<div className="d-flex flex-row justify-content-between">
							<span className="text-white">Withdraw Amount</span>
							<span className="text-white">
								Balance: {this.props.parentWalletBalance} {this.props.parentCurrency.toUpperCase()}
							</span>
						</div>
						<CustomInput
							type="number"
							label={withdrawAmountLabel || 'Withdrawal Amount'}
							defaultLabel="Withdrawal Amount"
							inputValue={amount}
							// placeholder={withdrawAmountLabel || 'Amount'}
							placeholder={
								this.props.minWithdrawAmount === undefined
									? withdrawAmountLabel || 'Amount'
									: 'Min Amount: ' + this.props.minWithdrawAmount + ' ' + currency.toUpperCase()
							}
							classNameInput="cr-withdraw__input"
							handleChangeInput={this.handleChangeInputAmount}
						/>
						<button
							onClick={() => this.handleChangeInputAmount(this.props.parentWalletBalance ?? '')}
							className="cr-withdraw__group__amount__all-btn"
						>
							All
						</button>
					</div>
					<div className={lastDividerClassName} />
					{!isMobileDevice && twoFactorAuthRequired && this.renderOtpCodeInput()}
				</div>
				<div className="cr-withdraw-column">
					{isMobileDevice && twoFactorAuthRequired && this.renderOtpCodeInput()}
					<div>
						<SummaryField
							className="cr-withdraw__summary-field"
							message={withdrawFeeLabel ? withdrawFeeLabel : 'Fee'}
							content={this.renderFee()}
						/>
						<SummaryField
							className="cr-withdraw__summary-field"
							message={withdrawTotalLabel ? withdrawTotalLabel : 'Total Withdraw Amount'}
							content={this.renderTotal()}
						/>
					</div>
					<div className="cr-withdraw__deep d-flex justify-content-end">
						<Button variant="primary" style={{ backgroundColor: '#2FB67E' }} size="lg" onClick={this.handleClick}>
							{withdrawButtonLabel ? withdrawButtonLabel : 'Withdraw'}
						</Button>
					</div>
				</div>
			</div>
		);
	}

	private renderFee = () => {
		const { fee, fixed, currency, ethFee } = this.props;

		return (
			<React.Fragment>
				<span hidden={Number(fee) === 0}>
					<Decimal fixed={fixed}>{fee}</Decimal>
					{' ' + currency.toUpperCase()}
				</span>
				<span hidden={Number(fee) !== 0}>
					<Decimal fixed={fixed}>{ethFee}</Decimal>
					{' ETH'}
				</span>
			</React.Fragment>
		);
	};

	private renderTotal = () => {
		const total = this.state.total;
		const { fixed, currency } = this.props;

		return total ? (
			<span>
				<Decimal fixed={fixed}>{total.toString()}</Decimal> {currency.toUpperCase()}
			</span>
		) : (
			<span>0 {currency.toUpperCase()}</span>
		);
	};

	private renderOtpCodeInput = () => {
		const { otpCode, withdrawCodeFocused } = this.state;
		const { withdraw2faLabel } = this.props;
		const withdrawCodeClass = classnames('cr-withdraw__group__code', {
			'cr-withdraw__group__code--focused': withdrawCodeFocused,
		});

		return (
			<React.Fragment>
				<div className={withdrawCodeClass} style={{ position: 'relative', marginTop: '1rem' }}>
					<span className="text-white">2FA code</span>
					<CustomInput
						type="number"
						label={withdraw2faLabel || '2FA code'}
						placeholder={withdraw2faLabel || '2FA code'}
						defaultLabel="2FA code"
						handleChangeInput={this.handleChangeInputOtpCode}
						inputValue={otpCode}
						handleFocusInput={() => this.handleFieldFocus('code')}
						classNameLabel="cr-withdraw__label"
						classNameInput="cr-withdraw__input"
						autoFocus={false}
					/>
				</div>
				<div className="cr-withdraw__divider cr-withdraw__divider-two" />
			</React.Fragment>
		);
	};

	private handleClick = () => {
		const { ethBallance, ethFee, fee } = this.props;
		const { amount, beneficiary, otpCode } = this.state;
		const { minWithdrawAmount, limitWitdraw24h } = this.props;
		const isPending = beneficiary.state && beneficiary.state.toLowerCase() === 'pending';
		const isLimitWithdraw24h = Number(limitWitdraw24h) === 0 ? false : Number(amount) > Number(limitWitdraw24h);

		if (Number(amount) < Number(minWithdrawAmount)) {
			this.props.pushAlert({ message: ['page.body.wallets.tabs.withdraw.amount.larger'], type: 'error' });
			return;
		}
		if (!beneficiary) {
			this.props.pushAlert({ message: ['page.body.wallets.tabs.withdraw.beneficiary.incorrect'], type: 'error' });
			return;
		}

		if (!Boolean(otpCode)) {
			this.props.pushAlert({ message: ['page.body.wallets.tabs.withdraw.2FA.missing'], type: 'error' });
			return;
		}
		if (isPending) {
			this.props.pushAlert({ message: ['page.body.wallets.tabs.withdraw.beneficiary.pending'], type: 'error' });
			return;
		}
		if (isLimitWithdraw24h) {
			this.props.pushAlert({ message: ['page.body.wallets.tabs.withdraw.limit24'], type: 'error' });
			return;
		}

		if (fee === 0) {
			// fee is zero, let use eth fee
			if (!ethBallance) {
				Modal.error({
					centered: true,
					icon: <FrownOutlined />,
					title: "Can't withdraw",
					content: `You need to generate ETH Wallets Address before withdraw!`,
				});

				return;
			}
			if (!ethFee || ethFee <= 0) {
				Modal.warning({
					centered: true,
					icon: <FrownOutlined />,
					title: "Can't withdraw",
					content: `ETH Fee is unavailable now!`,
				});

				return;
			}
			if (Number(ethBallance) < Number(ethFee)) {
				Modal.warning({
					centered: true,
					icon: <FrownOutlined />,
					title: "Can't withdraw",
					content: `You don't have enough ETH tokens to pay fee. Need more ${(
						Number(ethFee) - Number(ethBallance)
					).toFixed(5)} ETH Tokens`,
				});

				return;
			}
		}
		this.setState({
			...this.state,
			amount: '',
			otpCode: '',
		});
		this.props.onClick(this.state.amount, this.state.total, this.state.beneficiary, this.state.otpCode);
	};

	private handleFieldFocus = (field: string) => {
		switch (field) {
			case 'amount':
				this.setState(prev => ({
					withdrawAmountFocused: !prev.withdrawAmountFocused,
				}));
				break;
			case 'code':
				this.setState(prev => ({
					withdrawCodeFocused: !prev.withdrawCodeFocused,
				}));
				break;
			default:
				break;
		}
	};

	private handleChangeInputAmount = (value: string) => {
		const { fixed } = this.props;
		const convertedValue = cleanPositiveFloatInput(String(value));
		this.setState({
			amount: value,
		});
		if (convertedValue.match(precisionRegExp(fixed))) {
			const amount = convertedValue !== '' ? Number(parseFloat(convertedValue).toFixed(fixed)) : '';
			const total = amount !== '' ? (amount - this.props.fee).toFixed(fixed) : '';

			if (Number(total) <= 0) {
				this.setTotal((0).toFixed(fixed));
			} else {
				this.setTotal(total);
			}

			this.setState({
				amount: convertedValue,
			});
		}
	};

	private setTotal = (value: string) => {
		this.setState({ total: value });
	};

	private handleChangeBeneficiary = (value: Beneficiary) => {
		this.setState({
			beneficiary: value,
		});
	};

	private handleChangeInputOtpCode = (otpCode: string) => {
		this.setState({ otpCode });
	};
}

export interface CustomInputProps {
	type: string;
	label: string;
	defaultLabel: string;
	handleChangeInput?: (value: string) => void;
	inputValue: string | number;
	handleFocusInput?: () => void;
	placeholder: string;
	classNameLabel?: string;
	classNameInput?: string;
	autoFocus?: boolean;
	onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
	readOnly?: boolean;
	id?: string;
	handleClick?: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
	isDisabled?: boolean;
	labelVisible?: boolean;
	isInvalid?: boolean;
}

const mapDispatchToProps = dispatch => ({
	pushAlert: payload => dispatch(alertPush(payload)),
});

// tslint:disable-next-line no-any
const WithdrawComponent = injectIntl(connect(null, mapDispatchToProps)(Withdraw as any)) as any;

export { WithdrawComponent };

interface OnChangeEvent {
	target: {
		value: string;
	};
}
type Props = CustomInputProps;

class CustomInput extends React.Component<Props> {
	public render() {
		const {
			placeholder,
			inputValue,
			type,
			autoFocus,
			readOnly,
			id,
			handleClick,
			isDisabled,
			onKeyPress,
			isInvalid,
		} = this.props;

		return (
			<React.Fragment>
				<div className="custom-input">
					<InputGroup size="lg">
						<FormControl
							size="lg"
							type={type}
							value={inputValue.toString()}
							placeholder={placeholder}
							autoFocus={autoFocus}
							onFocus={this.props.handleFocusInput}
							onBlur={this.props.handleFocusInput}
							onChange={e => this.handleChangeValue(e)}
							readOnly={readOnly}
							id={id}
							onClick={handleClick}
							disabled={isDisabled}
							onKeyPress={onKeyPress}
							isInvalid={isInvalid}
						/>
					</InputGroup>
				</div>
			</React.Fragment>
		);
	}

	private handleChangeValue = (e: OnChangeEvent) => {
		this.props.handleChangeInput && this.props.handleChangeInput(e.target.value);
	};
}
