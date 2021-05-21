import { Modal } from 'antd';
import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { Beneficiaries, CustomInput, SummaryField } from '../../components';
import { Decimal } from '../../components/Decimal';
import { cleanPositiveFloatInput, precisionRegExp } from '../../helpers';
import { Beneficiary } from '../../modules';

import { FrownOutlined } from '@ant-design/icons';
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

export class Withdraw extends React.Component<WithdrawProps, WithdrawState> {
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
		const { amount, beneficiary, total, withdrawAmountFocused, otpCode } = this.state;
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
					<div className={withdrawAmountClass} style={{ position: 'relative', marginTop: '2rem' }}>
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
					</div>
					<div className={lastDividerClassName} />
					{!isMobileDevice && twoFactorAuthRequired && this.renderOtpCodeInput()}
				</div>
				<div className="cr-withdraw-column">
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
					{isMobileDevice && twoFactorAuthRequired && this.renderOtpCodeInput()}
					<div className="cr-withdraw__deep d-flex justify-content-end">
						<Button
							variant="primary"
							size="lg"
							onClick={this.handleClick}
							disabled={this.handleCheckButtonDisabled(total, beneficiary, otpCode)}
						>
							{withdrawButtonLabel ? withdrawButtonLabel : 'Withdraw'}
						</Button>
					</div>
				</div>

				<div className="withdrawNote">
					<div className="withdrawNote__right">
						<p>
							<span>1. Min Withdraw: </span>
							<span>{this.props.minWithdrawAmount + ' ' + currency.toUpperCase()}</span>
						</p>
						<p>
							<span>2. Withdraw Limit Daily: </span>
							<span>{this.props.limitWitdraw24h + ' ' + currency.toUpperCase()}</span>
						</p>
						<p>
							<span>
								3. Please withdrawal to your personal wallet address directly. Remember not to withdrawal to ICO's
								address, smart contract address, otherwise it may result the loss of assets.
							</span>
						</p>
					</div>
				</div>
			</div>
		);
	}

	private handleCheckButtonDisabled = (total: string, beneficiary: Beneficiary, otpCode: string) => {
		const { amount } = this.state;
		const { minWithdrawAmount, limitWitdraw24h } = this.props;

		const isPending = beneficiary.state && beneficiary.state.toLowerCase() === 'pending';
		return (
			Number(total) <= 0 ||
			!Boolean(beneficiary.id) ||
			isPending ||
			!Boolean(otpCode) ||
			Number(amount) < Number(minWithdrawAmount) ||
			Number(amount) > Number(limitWitdraw24h)
		);
	};

	private renderFee = () => {
		const { fee, fixed, currency, ethFee } = this.props;

		return (
			<span>
				<Decimal fixed={fixed}>{Number(fee) != 0 ? fee.toString() : ethFee}</Decimal>{' '}
				{Number(fee) != 0 ? currency.toUpperCase() : 'ETH'}
			</span>
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
				<div className={withdrawCodeClass} style={{ position: 'relative', marginTop: '2rem' }}>
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
		if (ethBallance === undefined && fee == 0) {
			Modal.error({
				centered: true,
				icon: <FrownOutlined />,
				title: "Can't withdraw",
				content: `You need to generate ETH Wallets Address before withdraw!`,
			});
		} else if (ethFee === undefined && Number(fee) === 0) {
			Modal.warning({
				centered: true,
				icon: <FrownOutlined />,
				title: "Can't withdraw",
				content: `ETH Fee is unavailable now!`,
			});
		} else if (Number(fee) === 0 && Number(ethBallance) < Number(ethFee)) {
			Modal.warning({
				centered: true,
				icon: <FrownOutlined />,
				title: "Can't withdraw",
				content: `You don\'t have enough ETH tokens to pay fee. Need more ${(
					Number(ethFee) - Number(ethBallance)
				).toFixed(5)} ETH Tokens`,
			});
		} else {
			this.props.onClick(this.state.amount, this.state.total, this.state.beneficiary, this.state.otpCode);
		}
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
