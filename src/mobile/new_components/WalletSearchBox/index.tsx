import { SearchIcon } from 'mobile/assets/icons';
import React, { FC } from 'react';

interface WalletSearchBoxProps {
	setSearchString: (e: string) => void;
}

export const WalletSearchBox: FC<WalletSearchBoxProps> = ({ setSearchString }) => {
	return (
		<div className="wallet-header__search-box">
			<SearchIcon className="wallet-header__search-box__icon" />
			<input
				className="wallet-header__search-box__input"
				type="text"
				placeholder="Search"
				onChange={e => setSearchString(e.target.value)}
			/>
		</div>
	);
};
