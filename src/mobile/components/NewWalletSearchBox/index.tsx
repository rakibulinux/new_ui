import { SearchIcon } from 'mobile/assets/icons';
import React, { FC, useRef } from 'react';

interface NewWalletSearchBoxProps {
	setSearchString: (e: string) => void;
}

export const WalletSearchBox: FC<NewWalletSearchBoxProps> = ({ setSearchString }) => {
	const typingTimeoutRef = useRef<any>(null);

	const handleSearchStringChange = e => {
		const { value } = e.target;

		if (typingTimeoutRef) {
			clearTimeout(typingTimeoutRef.current);
		}

		typingTimeoutRef.current = setTimeout(() => {
			setSearchString(value);
		}, 600);
	};

	return (
		<div className="wallet-header__search-box">
			<SearchIcon className="wallet-header__search-box__icon" />
			<input
				className="wallet-header__search-box__input"
				type="text"
				placeholder="Search"
				onChange={handleSearchStringChange}
			/>
		</div>
	);
};
