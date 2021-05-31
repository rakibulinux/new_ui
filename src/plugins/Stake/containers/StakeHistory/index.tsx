import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectStakeHistories, selectStakeHistoriesLoading } from '../../../../modules';
import { ReactTable } from '../../components';
import { format } from 'date-fns';
interface StakeHistoryProps {
	currency_id: string;
}
export const StakeHistory = (props: StakeHistoryProps) => {
	const { currency_id } = props;
	const stakeHistories = useSelector(selectStakeHistories);

	const formatStatus = (tx: string) => {
		const process = require('../../../../assets/status/wait.svg');
		const fail = require('../../../../assets/status/fail.svg');
		const success = require('../../../../assets/status/success.svg');
		const statusMapping = {
			succeed: <img src={success} alt="" />,
			distributed: <img src={success} alt="" />,
			canceled: <img src={fail} alt="" />,
			processing: <img src={process} alt="" />,
			pending: <img src={process} alt="" />,
		};

		return statusMapping[tx];
	};

	const histories = stakeHistories
		.filter(history => history.currency_id.toLowerCase() === currency_id.toLowerCase())
		.map(history => ({
			...history,
			period: `${history.period} days`,
			rate: `${history.rate}%`,
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
				Header: 'Rate',
				accessor: 'rate',
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
	const stakeHistoryLoading = useSelector(selectStakeHistoriesLoading);
	const stakedAmount: number = histories.length > 0 ? histories.map(history => history.amount).reduce((a, b) => a + b, 0) : 0;
	return (
		<div>
			<div>
				<span className="text-white text-left float-right">Total Staked: {stakedAmount.toFixed(5)}</span>
			</div>
			<ReactTable columns={columns} data={histories.reverse()} loading={stakeHistoryLoading} />
		</div>
	);
};
