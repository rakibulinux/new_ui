import React, { FC } from 'react';
import { WalletSearchBox } from '../WalletSearchBox';
import { WalletToggle } from '../WalletToggle';

interface WalletHeaderProps {
	setSearchString: (e: string) => void;
	setHideSmallBalance: (e: boolean) => void;
}

export const WalletHeader: FC<WalletHeaderProps> = ({ setSearchString, setHideSmallBalance }) => {
	return (
		<div className="wallet-header">
			<WalletSearchBox setSearchString={setSearchString} />
			<WalletToggle setHideSmallBalance={setHideSmallBalance} />
		</div>
	);
};
