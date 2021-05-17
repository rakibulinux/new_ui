import classNames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectStakeWallet } from '../../../../../modules';

interface UnStakeProps {
	currency_id: string;
}

export const UnStake: React.FC<UnStakeProps> = (props: UnStakeProps) => {
	const { currency_id } = props;
	const [amountState, setAmountState] = React.useState('');
	const [agreeState, setAgreeState] = React.useState(false);
	const stake_wallets = useSelector(selectStakeWallet);
	const stake_wallet = stake_wallets.find(wallet => wallet.currency === currency_id) || { balance: 0, locked: 0 };

	const isDisableUnstake =
		!agreeState || Number(amountState || 0) > Number(stake_wallet.balance || 0) || Number(amountState) <= 0;
	const unStakeClassNames = classNames('unstake-btn', isDisableUnstake ? 'unstake-btn--disabled' : '');
	return (
		<div id="un-stake-mobile">
			<div className="container">
				<div className="row">
					<div className="col-12 text-right">
						<span className="amount-number">
							Available Amount: {stake_wallet.balance} {currency_id.toUpperCase()}
						</span>
						<div className="amount-box">
							<span>AMOUNT</span>
							<input
								value={amountState}
								type="number"
								placeholder="0"
								onChange={e => {
									const amount = e.target.value;
									if (Number(amount) >= 0) setAmountState(amount);
								}}
							/>
							<span>{currency_id.toUpperCase()}</span>
						</div>
					</div>
				</div>
				<div className="row mt-5">
					<div className="col-12">
						<label className="agree">
							<input type="checkbox" onChange={e => setAgreeState(e.target.checked)} />I have read and agree with
							the cautions.
						</label>
					</div>
				</div>
				<div className="row mt-2">
					<div className="col-12">
						<button disabled={isDisableUnstake} className={unStakeClassNames}>
							UNSTAKE
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
