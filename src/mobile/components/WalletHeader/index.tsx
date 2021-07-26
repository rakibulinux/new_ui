import * as React from 'react';
import { CryptoIcon } from '../../../components/CryptoIcon';

interface Props {
	currency: string;
	name: string;
	iconUrl?: string;
}

const WalletHeaderComponent = (props: Props) => {
	return (
		<div className="td-wallet-mobile-header">
			<div>
				{props.iconUrl ? (
					<img alt="" src={props.iconUrl} />
				) : (
					<CryptoIcon className="td-wallet-item__icon" code={props.currency.toUpperCase()} />
				)}
			</div>
			<div className="td-wallet-mobile-header__text">
				<span className="td-wallet-mobile-header__text-currency">{props.currency}</span>
				<span className="td-wallet-mobile-header__text-name">{props.name}</span>
			</div>
		</div>
	);
};

const WalletHeader = React.memo(WalletHeaderComponent);

export { WalletHeader };
