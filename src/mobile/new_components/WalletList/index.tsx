import React, { FC } from 'react';
import { WalletItem } from '../WalletItem';

interface WalletListProps {
	data: any[];
}

export const WalletList: FC<WalletListProps> = ({ data=[] }) => {

	if (data.length === 0) {
		return <div className="wallet-list wallet-list--empty">Nothing to show</div>;
	}

	return (
		<div className="wallet-list">
			{data.map(wallet => (
				<WalletItem key={wallet.currency} {...wallet} />
			))}
		</div>
	);
};
