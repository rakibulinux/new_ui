import * as React from 'react';
import { useIntl } from 'react-intl';
import { Decimal } from '../../../components/Decimal';
/* import { DEFAULT_CCY_PRECISION } from '../../../constants'; */
import { areEqualSelectedProps } from '../../../helpers/areEqualSelectedProps';

interface Props {
	wallet: any;
}

const WalletBannerComponent = (props: Props) => {
	const {
		wallet: { balance = 0, locked = 0, fixed = 6 },
	} = props;
	const intl = useIntl();

	return (
		<div className="cr-wallet-banner-mobile">
			<div className="info-grid">
				<div className="available">{intl.formatMessage({ id: 'page.mobile.wallets.banner.available' })}</div>
				<div className="lock">{intl.formatMessage({ id: 'page.mobile.wallets.banner.lock' })}</div>
				<div className="available_amout">
					<Decimal fixed={fixed} children={balance || 0} />
				</div>
				<div className="lock_amout">
					<Decimal fixed={fixed} children={locked || 0} />
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
