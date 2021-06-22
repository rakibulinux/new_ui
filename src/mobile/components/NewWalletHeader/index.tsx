import React, { FC } from 'react';
import { WalletSearchBox } from '../NewWalletSearchBox';
import { NewWalletToggle } from '../NewWalletToggle';

interface NewWalletHeaderProps {
	setSearchString: (e: string) => void;
	setHideSmallBalance: (e: boolean) => void;
}

export const NewWalletHeader: FC<NewWalletHeaderProps> = ({ setSearchString, setHideSmallBalance }) => {
	return (
		<div className="wallet-header">
			<WalletSearchBox setSearchString={setSearchString} />
			<NewWalletToggle setHideSmallBalance={setHideSmallBalance} />
		</div>
	);
};
