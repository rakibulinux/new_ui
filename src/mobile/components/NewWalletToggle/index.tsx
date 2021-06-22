import React, { FC } from 'react';

interface NewWalletToggleProps {
	setHideSmallBalance: (e: boolean) => void;
}

export const NewWalletToggle: FC<NewWalletToggleProps> = ({ setHideSmallBalance }) => {
	return (
		<div className="wallet-toggle">
			<span>Hide Small Balance</span>

			<label htmlFor="hide-small-balance" className="wallet-toggle__checkbox">
				<input
					className="wallet-toggle__checkbox__input"
					type="checkbox"
					name="hide-small-balance"
					id="hide-small-balance"
					onChange={e => setHideSmallBalance(e.target.checked)}
				/>
				<div className="wallet-toggle__checkbox__dot"></div>
			</label>
		</div>
	);
};
