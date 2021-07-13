import { Blur, QRCode } from 'components';
import { copy, formatCCYAddress, getTabName } from 'helpers';
import {
	alertPush,
	currenciesFetch,
	selectChildCurrencies,
	selectCurrencies,
	selectWalletAddress,
	selectWallets,
	walletsAddressFetch,
	walletsChildCurrenciesFetch,
	walletsFetch,
} from 'modules';
import Tabs, { TabPane } from 'rc-tabs';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';

const BackSVG = (
	<svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M18 5H3.83L7.41 1.41L6 0L0 6L6 12L7.41 10.59L3.83 7H18V5Z" fill="white" />
	</svg>
);
const HistorySVG = (
	<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M18 7.12H11.22L13.96 4.3C11.23 1.6 6.81 1.5 4.08 4.2C1.35 6.91 1.35 11.28 4.08 13.99C6.81 16.7 11.23 16.7 13.96 13.99C15.32 12.65 16 11.08 16 9.1H18C18 11.08 17.12 13.65 15.36 15.39C11.85 18.87 6.15 18.87 2.64 15.39C-0.859996 11.92 -0.889996 6.28 2.62 2.81C6.13 -0.66 11.76 -0.66 15.27 2.81L18 0V7.12ZM9.5 5V9.25L13 11.33L12.28 12.54L8 10V5H9.5Z"
			fill="white"
		/>
	</svg>
);

const DepositSubHeader = props => {
	const history = useHistory();
	const { currency } = props;

	return (
		<div className="td-mobile-wallet-detail__header">
			<div onClick={() => history.goBack()}>{BackSVG}</div>{' '}
			<h3 className="td-mobile-wallet-detail__header__title">Deposit</h3>
			<Link className="td-mobile-wallet-detail__header__history" to={`/wallets/${currency}/history`}>
				{HistorySVG}
			</Link>
		</div>
	);
};

const DepositBody = props => {
	const dispatch = useDispatch();
	const { currency } = props;

	const selectedWalletAddress = useSelector(selectWalletAddress);
	const wallets = useSelector(selectWallets);
	const currencies = useSelector(selectCurrencies);
	const childs = useSelector(selectChildCurrencies);
	const childIDs = childs.map(child => child.id);
	const listCurrencies = currencies.filter(cur => childIDs.includes(cur.id) || cur.id === currency);
	const listCurrenciesWallets = listCurrencies.map(list => {
		const wallet = wallets.find(wallet => wallet.currency === list.id);

		return {
			id: list.id,
			name: list.name,
			deposit_enabled: list.deposit_enabled,
			deposit_fee: list.deposit_fee,
			balance: wallet?.balance,
			address: wallet?.address,
			type: wallet?.type,
			blockchain_key: list.blockchain_key,
			icon_url: list.icon_url,
		};
	});

	const handleChangeTab = (currency: string) => {
		dispatch(walletsAddressFetch({ currency }));
	};

	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency: currency }));
	}, [currency, dispatch]);

	const renderTabBody = (currency: string) => {
		const QR_SIZE = 200;
		const walletAddress = formatCCYAddress(currency, selectedWalletAddress);
		const size = QR_SIZE;
		const doCopy = () => {
			copy(`copy_deposit_${currency}`);
			if (walletAddress) {
				dispatch(
					alertPush({
						message: ['page.body.wallets.tabs.deposit.ccy.message.success'],
						type: 'success',
					}),
				);
			}
		};

		const currencyItem = currencies.find(cur => cur.id === currency);

		return (
			<div className="tab-body" hidden={!walletAddress}>
				<div className="py-4 text-center">
					<QRCode dimensions={size} data={walletAddress} />
				</div>
				<div className="py-4 deposit-address">
					<div className="deposit-address__title">Deposit address</div>
					<input readOnly id={`copy_deposit_${currency}`} className="deposit-address__text" value={walletAddress} />

					<button onClick={doCopy} className="deposit-address__copy-btn mt-3">
						Copy address
					</button>
				</div>
				<div hidden={currencyItem && currencyItem.deposit_enabled} className="deposit-disabled">
					<Blur text="Deposit is disabled" />
				</div>
			</div>
		);
	};

	return (
		<div className="deposit-body">
			<div className="deposit-body__tabs">
				<div className="react-tabs">
					<Tabs defaultActiveKey={listCurrenciesWallets[0]?.id} onChange={handleChangeTab}>
						{listCurrenciesWallets.map(wallet => (
							<TabPane tab={getTabName(wallet.blockchain_key || '')} key={wallet.id || ''}>
								{renderTabBody(wallet.id)}
							</TabPane>
						))}
					</Tabs>
				</div>
			</div>
		</div>
	);
};

const DepositNotes = props => {
	const { currency } = props;
	const currencies = useSelector(selectCurrencies);
	const { min_deposit_amount, deposit_fee } = currencies.find(cur => cur.id === currency) || { min_deposit_amount: null };
	const cartSVG = (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M4.8 12.8C3.92 12.8 3.208 13.52 3.208 14.4C3.208 15.28 3.92 16 4.8 16C5.68 16 6.4 15.28 6.4 14.4C6.4 13.52 5.68 12.8 4.8 12.8ZM0 0V1.6H1.6L4.48 7.672L3.4 9.632C3.272 9.856 3.2 10.12 3.2 10.4C3.2 11.28 3.92 12 4.8 12H14.4V10.4H5.136C5.024 10.4 4.936 10.312 4.936 10.2L4.96 10.104L5.68 8.8H11.64C12.24 8.8 12.768 8.472 13.04 7.976L15.904 2.784C15.968 2.672 16 2.536 16 2.4C16 1.96 15.64 1.6 15.2 1.6H3.368L2.616 0H0ZM12.8 12.8C11.92 12.8 11.208 13.52 11.208 14.4C11.208 15.28 11.92 16 12.8 16C13.68 16 14.4 15.28 14.4 14.4C14.4 13.52 13.68 12.8 12.8 12.8Z"
				fill="white"
			/>
		</svg>
	);

	return (
		<div className="depost-notes">
			<hr style={{ border: '1px solid #848E9C' }} />

			<div className="depost-notes__header">
				<p className="text-white">{cartSVG} No Tokens, Go buy</p>
			</div>
			<div className="depost-notes__body">
				<p className="text-warning"> 1. Coins will be deposited after 1 network confirmations.</p>
				<p>
					2. Min Deposit: {min_deposit_amount ?? 'Unavailble'} {String(currency).toUpperCase()}
				</p>
				<p>
					3. Deposit Fee: {deposit_fee ?? 'Unavailble'} {String(currency).toUpperCase()}
				</p>
			</div>
		</div>
	);
};

export const DepositMobileScreen = () => {
	const { currency = '' } = useParams<{ currency: string }>();
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency: currency }));
	}, [currency, dispatch]);

	React.useEffect(() => {
		dispatch(currenciesFetch());
		dispatch(walletsFetch());
	}, []);
	React.useEffect(() => {
		dispatch(walletsChildCurrenciesFetch({ currency: currency }));
	}, [currency, dispatch]);

	return (
		<div id="td-mobile-screen-deposit">
			<DepositSubHeader currency={currency} />
			<DepositBody currency={currency} />
			<DepositNotes currency={currency} />
		</div>
	);
};
