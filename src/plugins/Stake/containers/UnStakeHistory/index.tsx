import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrencies, selectUnstakeHistory, selectUnstakeHistoryLoading } from '../../../../modules';
import { ReactTable } from '../../components';
import { format } from 'date-fns';
interface UnStakeHistoryProps {
	currency_id: string;
}
export const UnStakeHistory = (props: UnStakeHistoryProps) => {
	const { currency_id } = props;
	const unstakeHistories = useSelector(selectUnstakeHistory);
	const unstakeHistoryLoading = useSelector(selectUnstakeHistoryLoading);
	const currencies = useSelector(selectCurrencies);

	const columns = React.useMemo(() => {
		return [
			{
				Header: 'Currency',
				accessor: 'currency_id',
			},
			{
				Header: 'Amount',
				accessor: 'amount',
			},
			{
				Header: 'Unstaked Date',
				accessor: 'completed_at',
			},
		];
	}, []);

	const findIcon = (code: string): string => {
		const currency = currencies.find((currencyParam: any) => currencyParam.id === code);
		try {
			return require(`../../../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}

			return require('../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const histories = unstakeHistories
		.filter(history => history.currency_id.toLowerCase() === currency_id.toLowerCase())
		.map(history => ({
			...history,
			currency_id: <img width="24px" height="24px" src={findIcon(history.currency_id)} alt={history.currency_id} />,
			amount: Number(history.amount),
			completed_at: format(new Date(history.completed_at), 'yyyy-MM-dd hh:mm:ss'),
		}));
	const unStakedAmount: number = histories.length > 0 ? histories.map(history => history.amount).reduce((a, b) => a + b, 0) : 0;

	return (
		<div>
			<div>
				<span className="text-white text-left float-right">Total UnStaked: {unStakedAmount.toFixed(5)}</span>
			</div>
			<ReactTable columns={columns} data={histories.reverse()} loading={unstakeHistoryLoading} />
		</div>
	);
};
