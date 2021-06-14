import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Decimal } from '../../components';
import { ReactTable } from '../../containers';
import { EstimatedValue } from '../../containers/Wallets/EstimatedValue';
import { setDocumentTitle } from '../../helpers';
import {
	walletsFetch,
	currenciesFetch,
	allChildCurrenciesFetch,
	beneficiariesFetch,
	selectWallets,
	selectCurrencies,
	selectAllChildCurrencies,
} from '../../modules';
import NP from 'number-precision';
NP.enableBoundaryChecking(false); // default param is true

export interface WalletItem {
	key: string;
	address?: string;
	currency: string;
	name: string;
	balance?: string;
	locked?: string;
	type: 'fiat' | 'coin';
	fee: number;
	active?: boolean;
	fixed: number;
	iconUrl?: string;
}

export const WalletListScreen = () => {
	setDocumentTitle('Wallets');
	const intl = useIntl();

	// state
	const [hideSmallBalanceState, setHideSmallBalanceState] = React.useState<boolean>(false);

	// intl
	const withdrawButtonLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw' }), [intl]);
	const depositButtonLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.deposit' }), [intl]);

	// history
	const history = useHistory();

	// dispatch
	const dispatch = useDispatch();
	const dispatchFetchWallets = () => dispatch(walletsFetch());
	const dispatchcFetchCurrencies = () => dispatch(currenciesFetch());
	const dispatchcFetchAllChildCurrencies = () => dispatch(allChildCurrenciesFetch());
	const dispatchFetchBeneficiaries = () => dispatch(beneficiariesFetch());

	// side effect
	React.useEffect(() => {
		dispatchFetchWallets();
		dispatchcFetchCurrencies();
		dispatchcFetchAllChildCurrencies();
		dispatchFetchBeneficiaries();
	}, []);

	// selector
	const wallets = useSelector(selectWallets);
	const currencies = useSelector(selectCurrencies);
	const all_child_currencies = useSelector(selectAllChildCurrencies);

	// function
	const findIcon = (code: string): string => {
		const currency = currencies.find((currency: any) => currency.id === code);
		try {
			return require(`../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency !== undefined && currency.icon_url) {
				return currency.icon_url;
			}
			return require('../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const columns = React.useMemo(
		() => [
			{ Header: 'Coin', accessor: 'coin' },
			{ Header: 'Total', accessor: 'total' },
			{ Header: 'Available', accessor: 'available' },
			{ Header: 'In Order', accessor: 'in_order' },
			{ Header: 'Action', accessor: 'action' },
		],
		[],
	);

	const [searchInputState, setSearchInputState] = React.useState('');
	console.log(currencies);

	const data = wallets
		.filter(wallet => !all_child_currencies.map(cur => cur.id).includes(wallet.currency))
		.map(wallet => {
			const childCurrencies = all_child_currencies
				.filter(childCurrency => childCurrency.parent_id === wallet.currency)
				.map(childCurrency => childCurrency.id);

			const totalChildBalances = wallets
				.filter(wal => childCurrencies.includes(wal.currency))
				.map(child => Number(child.balance))
				.reduce((x, y) => x + y, 0);

			const totalChildLocked = wallets
				.filter(wal => childCurrencies.includes(wal.currency))
				.map(child => Number(child.locked))
				.reduce((x, y) => x + y, 0);

			return {
				...wallet,
				total: Number(wallet.balance) + Number(wallet.locked) + totalChildBalances + totalChildLocked,
				balance: Number(wallet.balance) + totalChildBalances,
				locked: Number(wallet.locked) + totalChildLocked,
			};
		})
		.filter(wallet => wallet.currency.toLowerCase().includes(searchInputState.toLowerCase()))
		.filter(wallet => (hideSmallBalanceState ? wallet.total > 0 : true))
		.sort((prev_wallet, next_wallet) => {
			//sort desc
			return next_wallet.total - prev_wallet.total;
		})
		.map((wallet, index) => {
			const total = NP.plus(wallet.balance || 0, wallet.locked || 0);
			const currency_icon = (
				<img
					width="30px"
					height="30px"
					src={wallet.iconUrl ? wallet.iconUrl : findIcon(wallet.currency)}
					alt={wallet.currency + '_icon'}
				/>
			);
			const isWithdrawEnabled = wallet.type === 'fiat' || wallet.balance;
			const { fixed } = wallets.find(w => w.currency === wallet.currency) || { fixed: 8 };

			return {
				coin: (
					<span className="text-left">
						{' '}
						{currency_icon} {wallet.currency.toUpperCase()} <span className="text-secondary">{wallet.name}</span>
					</span>
				),
				total: (
					<Decimal key={index} fixed={fixed}>
						{total > 0 ? total : 0}
					</Decimal>
				),
				available: (
					<span>
						<Decimal key={index} fixed={fixed}>
							{wallet.balance > 0 ? wallet.balance : 0}
						</Decimal>
					</span>
				),
				in_order: (
					<span className="text-secondary">
						<Decimal key={index} fixed={fixed}>
							{wallet.locked > 0 ? wallet.locked : 0}
						</Decimal>
					</span>
				),
				action: (
					<div className="d-flex flex-row">
						<button
							className="deposit-button"
							onClick={() =>
								history.push({ pathname: '/wallets/deposit/' + String(wallet.currency).toUpperCase() })
							}
						>
							{depositButtonLabel}
						</button>
						<button
							className="withdraw-button"
							disabled={!isWithdrawEnabled}
							onClick={() =>
								history.push({ pathname: '/wallets/withdraw/' + String(wallet.currency).toUpperCase() })
							}
						>
							{withdrawButtonLabel}
						</button>
					</div>
				),
			};
		});
	console.table(data);

	const renderTable = () => {
		return <ReactTable columns={columns} data={[...data]} headColor="#222B42" />;
	};

	const onChange = e => {
		setSearchInputState(String(e.target.value).toUpperCase());
	};

	return (
		<div id="wallet-list-screen">
			<div
				className="container-fluid"
				style={{
					backgroundColor: '#2D2E3D',
					borderRadius: '5px',
					minHeight: '100vh',
					padding: '20px 10%',
				}}
			>
				<div className="row">
					<div className="col-12">
						<EstimatedValue wallets={wallets} />
					</div>
				</div>
				<div className="row mt-3">
					<div className="col-12 d-flex justify-content-between align-items-center flex-row">
						<input
							className="search-input"
							autoFocus
							type="text"
							value={searchInputState}
							placeholder="Search coin ..."
							onChange={e => onChange(e)}
						/>
						<div className="checkbox-input">
							<span className="mr-2 text-white">
								{intl.formatMessage({ id: 'page.body.plugins.wallet.list.button.hideSmallBalance' })}
							</span>
							<label className="checkbox bounce">
								<input
									type="checkbox"
									checked={hideSmallBalanceState}
									onChange={e => setHideSmallBalanceState(e.target.checked)}
								/>
								<svg viewBox="0 0 21 21">
									<polyline points="5 10.75 8.5 14.25 16 6"></polyline>
								</svg>
							</label>
						</div>
					</div>
				</div>
				<div className="row mt-3">
					<div className="col-12">{renderTable()}</div>
				</div>
			</div>
		</div>
	);
};
