import * as React from 'react';
import { useSelector } from 'react-redux';
import { getTimeZone } from '../../../../helpers';
import { selectStakeHistories, selectStakeHistoriesLoading } from '../../../../modules';
import { ReactTable } from '../../components';
import { format } from 'date-fns';
interface StakeHistoryProps {
	currency_id: string;
}
export const StakeHistory = (props: StakeHistoryProps) => {
	const { currency_id } = props;
	const stake_histories = useSelector(selectStakeHistories);

	const formatStatus = (tx: string) => {
		const process = require('../../../../assets/status/wait.svg');
		const fail = require('../../../../assets/status/fail.svg');
		const success = require('../../../..//assets/status/success.svg');
		const statusMapping = {
			succeed: <img src={success} alt="" />,
			distributed: <img src={success} alt="" />,
			canceled: <img src={fail} alt="" />,
			processing: <img src={process} alt="" />,
			pending: <img src={process} alt="" />,
		};

		return statusMapping[tx];
	};

	const histories = stake_histories
		.filter(history => history.currency_id.toLowerCase() === currency_id.toLowerCase())
		.map(history => ({
			...history,
			period: `${history.period} days`,
			amount: Number(history.amount),
			lockup_date: format(new Date(history.lockup_date), 'yyyy-MM-dd hh:mm:ss'),
			release_date: format(new Date(history.release_date), 'yyyy-MM-dd hh:mm:ss'),
			status: formatStatus(history.status),
		}));
	const columns = React.useMemo(() => {
		return [
			{
				Header: 'Period',
				accessor: 'period',
			},
			{
				Header: 'Amount',
				accessor: 'amount',
			},
			{
				Header: 'Lockup Date',
				accessor: 'lockup_date',
			},
			{
				Header: 'Release',
				accessor: 'release_date',
			},
			{
				Header: 'Status',
				accessor: 'status',
			},
		];
	}, []);
	const stake_history_loading = useSelector(selectStakeHistoriesLoading);

	return (
		<div>
			<span className="text-white text-right float-right">Timezone: GMT{getTimeZone()}</span>
			<ReactTable columns={columns} data={histories.reverse()} loading={stake_history_loading} />
		</div>
	);
};
