import { ChildCurrency, Wallet } from 'modules';

export const calcWalletsData = (
	wallets: Wallet[],
	allChildCurrencies: ChildCurrency[],
	precision = 6,
) => {

	const dict = {};
	for (const wallet of wallets) { dict[wallet.currency] = {...wallet, child_currencies: []}; }
	for (const childCurrency of allChildCurrencies){
		dict[childCurrency.parent_id].child_currencies.push(childCurrency.id);
	}

	const data : Wallet[] = [];
	for (const key in dict){
		let totalBalance =  Number(dict[key].balance) || 0;
		let totalLocked = Number(dict[key].locked) || 0;

		for (const c of dict[key].child_currencies){
			totalBalance += Number(dict[c].balance) || 0;
			totalLocked += Number(dict[c].locked) || 0;
		}
		data.push({
			...dict[key],
			total: Number(totalBalance + totalLocked).toFixed(precision),
			balance: Number(totalBalance).toFixed(precision),
			locked: Number(totalLocked).toFixed(precision),
		});
	}

	return data;
};
