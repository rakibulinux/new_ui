import * as React from 'react';
import { useSelector } from 'react-redux';
import { CryptoIcon } from '../../../components/CryptoIcon';
import { Decimal } from '../../../components/Decimal';
/* import { DEFAULT_CCY_PRECISION } from '../../../constants'; */
import { areEqualSelectedProps } from '../../../helpers/areEqualSelectedProps';
import { selectAllChildCurrencies, selectWallets } from '../../../modules';

interface Props {
	wallet;
	onClick: (v: string) => void;
}

const WalletItemComponent = (props: Props) => {
	const {
		wallet: { currency = '', name, balance = 0, fixed = 6, iconUrl },
	} = props;
	const allChildCurrencies = useSelector(selectAllChildCurrencies);
	const wallets = useSelector(selectWallets);

	const childCurrencies = allChildCurrencies
		.filter(childCurrency => childCurrency.parent_id === currency)
		.map(childCurrency => childCurrency.id);

	const totalChildBalances = wallets
		.filter(wal => childCurrencies.includes(wal.currency))
		.map(child => Number(child.balance))
		.reduce((x, y) => x + y, 0);

	return (
		<div className="cr-mobile-wallet-item" onClick={() => props.onClick(currency)}>
			<div>
				{iconUrl ? (
					<img alt="" src={iconUrl} />
				) : (
					<CryptoIcon className="cr-wallet-item__icon" code={currency.toUpperCase()} />
				)}
				<span className="cr-mobile-wallet-item__currency">{currency}</span>
				<span className="cr-mobile-wallet-item__name">{name}</span>
			</div>
			<div className="cr-mobile-wallet-item__balance">
				<span>
					<Decimal fixed={fixed} children={Number(balance) + totalChildBalances || 0} />
				</span>
			</div>
		</div>
	);
};

const WalletItem = React.memo(
	WalletItemComponent,
	areEqualSelectedProps('wallet', ['currency', 'name', 'balance', 'fixed', 'iconUrl']),
);

export { WalletItem };
