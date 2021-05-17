import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectStakeHistories,
	selectStakeWallet,
	selectStakeWalletLoading,
	selectWallets,
	walletsFetch,
} from '../../../../../modules';
import { LoadingSpinner } from '../../components';

interface MyAssetsProps {
	currency_id: string;
}

export const MyAssets = (props: MyAssetsProps) => {
	const intl = useIntl();

	const { currency_id } = props;
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(walletsFetch());
	}, []);
	const wallets = useSelector(selectWallets);
	const wallet = wallets.find(wallet => wallet.currency === currency_id) || { balance: 0, locked: 0 };

	const stake_wallets = useSelector(selectStakeWallet);
	const stake_wallet = stake_wallets.find(wallet => wallet.currency === currency_id) || { balance: 0, locked: 0 };

	const stake_histories = useSelector(selectStakeHistories);
	const histories = stake_histories
		.filter(history => history.currency_id === currency_id)
		.map(history => ({
			...history,
			amount: Number(history.amount),
		}));
	const staked_amount: number =
		histories.length > 0
			? histories
					.map(history => history.amount)
					.reduce((accumulator, currentValue, currentIndex, array) => accumulator + currentValue)
			: 0;
	const isLoadingStakeWallet = useSelector(selectStakeWalletLoading);
	return (
		<div id="my-assets-mobile">
			<div style={{ position: 'relative' }}>
				<div className="assets-container">
					<span className="key staked-amount-title text-primary">
						{intl.formatMessage({ id: `stake.detail.myAssets.stakedAmount` })}
					</span>
					<span className="value staked-amount-value text-primary">{staked_amount.toFixed(8)}</span>
				</div>
				<div className="assets-container">
					<span className="key text-info">{intl.formatMessage({ id: `stake.detail.myAssets.availableUnstake` })}</span>
					<span className="value text-info">{Number(stake_wallet.balance).toFixed(8)}</span>
				</div>
				<LoadingSpinner loading={isLoadingStakeWallet} />
			</div>
			<hr />
			<div style={{ position: 'relative' }}>
				<div className="assets-container">
					<span className="key">{intl.formatMessage({ id: `stake.detail.myAssets.available` })}</span>
					<span className="value">{(Number(wallet.balance) + Number(wallet.locked)).toFixed(8)}</span>
				</div>
				<div className="assets-container">
					<span className="key">{intl.formatMessage({ id: `stake.detail.myAssets.totalBalance` })}</span>
					<span className="value">{Number(wallet.balance).toFixed(8)}</span>
				</div>
			</div>
		</div>
	);
};
