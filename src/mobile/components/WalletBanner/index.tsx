import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Decimal } from '../../../components/Decimal';
/* import { DEFAULT_CCY_PRECISION } from '../../../constants'; */
import { areEqualSelectedProps } from '../../../helpers/areEqualSelectedProps';
import { selectWallets, selectAllChildCurrencies } from '../../../modules';

interface Props {
	wallet: any;
}

const WalletBannerComponent = (props: Props) => {
	const {
		wallet: { currency = '', balance = 0, locked = 0, fixed = 6 },
	} = props;
	const intl = useIntl();

	const allChildCurrencies = useSelector(selectAllChildCurrencies);
	const wallets = useSelector(selectWallets);

	const childCurrencies = allChildCurrencies
		.filter(childCurrency => childCurrency.parent_id === currency)
		.map(childCurrency => childCurrency.id);

	const totalChildBalances = wallets
		.filter(wal => childCurrencies.includes(wal.currency))
		.map(child => Number(child.balance))
		.reduce((x, y) => x + y, 0);
	const totalChildLocked = wallets
		.filter(wal => childCurrencies.includes(wal.currency))
		.map(child => Number(child.locked))
		.reduce((x, y) => x + y, 0);

	return (
		<div className="td-wallet-banner-mobile">
			<div className="info-grid">
				<div className="available">{intl.formatMessage({ id: 'page.mobile.wallets.banner.available' })}</div>
				<div className="lock">{intl.formatMessage({ id: 'page.mobile.wallets.banner.lock' })}</div>
				<div className="available_amout">
					<Decimal fixed={fixed} children={totalChildBalances + Number(balance) || 0} />
				</div>
				<div className="lock_amout">
					<Decimal fixed={fixed} children={totalChildLocked + Number(locked) || 0} />
				</div>
			</div>
		</div>
	);
};

const WalletBanner = React.memo(
	WalletBannerComponent,
	areEqualSelectedProps('wallet', ['balance', 'locked', 'currency', 'fixed']),
);

export { WalletBanner };
