export const getTabName = (blockchain_key: string) => {
	const tab_names = [
		{
			name: 'Bitcoin',
			blockchain_key: 'bitcoin',
		},
		{
			name: 'ERC20',
			blockchain_key: 'eth-testnet',
		},
		{
			name: 'TRON20',
			blockchain_key: 'tron-test',
		},
		{
			name: 'BEP20',
			blockchain_key: 'bsc-testnet',
		},
	];
	const foundTab = tab_names.find(tab_name => tab_name.blockchain_key.toLowerCase() === blockchain_key.toLowerCase());
	return foundTab ? foundTab.name : 'not found';
};
