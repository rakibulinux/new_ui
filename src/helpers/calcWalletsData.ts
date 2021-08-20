import { ChildCurrency, Wallet } from 'modules';

export const calcWalletsData = (wallets: Wallet[], allChildCurrencies: ChildCurrency[], precision = 6) => {
	return wallets
		.filter(wallet => !allChildCurrencies.map(cur => cur.id).includes(wallet.currency))
		.map(wallet => {
			const childCurrencies = allChildCurrencies
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
				total: Number(wallet.balance) + Number(wallet.locked) + totalChildBalances + totalChildLocked || 0,
				balance: Number(wallet.balance) + totalChildBalances || 0,
				locked: Number(wallet.locked) + totalChildLocked,
			};
		})
		.sort((prevWallet, nextWallet) => {
			//sort desc
			return nextWallet.total - prevWallet.total;
		});
};
