import React, { FC } from 'react';
import { NewWalletItem } from '../NewWalletItem';

interface NewWalletListProps {
	data: any[];
}

export const NewWalletList: FC<NewWalletListProps> = ({ data = [] }) => {
	if (data.length === 0) {
		return <div className="wallet-list wallet-list--empty">Nothing to show</div>;
	}

	return (
		<div className="wallet-list">
			{data.map(wallet => (
				<NewWalletItem key={wallet.currency} {...wallet} />
			))}
		</div>
	);
};
