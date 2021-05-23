import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Decimal } from '../../../components/Decimal';
/* import { DEFAULT_CCY_PRECISION } from '../../../constants'; */
import { areEqualSelectedProps } from '../../../helpers/areEqualSelectedProps';
import { selectWallets, selectChildCurrencies } from '../../../modules';

interface Props {
	wallet: any;
}

const WalletBannerComponent = (props: Props) => {
	const {
		wallet: { balance = 0, locked = 0, fixed = 6 },
	} = props;
	const intl = useIntl();

	const wallets = useSelector(selectWallets);
	const childCurrencies = useSelector(selectChildCurrencies);
	const childCurrenciesIds = childCurrencies.map(child => child.id);
	const childWallets = wallets.filter(wallet => childCurrenciesIds.includes(wallet.currency)) || {};
	const childBalances = childWallets.map(child => Number(child.balance)) || [];
	const childLockeds = childWallets.map(child => Number(child.locked)) || [];
	const totalChildBalance = childBalances.reduce((x, y) => x + y, 0);
	const totalChildLocked = childLockeds.reduce((x, y) => x + y, 0);
	const totalBalances = Number(balance) + Number(totalChildBalance);
	const totalLocked = Number(locked) + Number(totalChildLocked);

	return (
		<div className="cr-wallet-banner-mobile">
			<div className="info-grid">
				<div className="available">{intl.formatMessage({ id: 'page.mobile.wallets.banner.available' })}</div>
				<div className="lock">{intl.formatMessage({ id: 'page.mobile.wallets.banner.lock' })}</div>
				<div className="available_amout">
					<Decimal fixed={fixed} children={totalBalances || 0} />
				</div>
				<div className="lock_amout">
					<Decimal fixed={fixed} children={totalLocked || 0} />
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
