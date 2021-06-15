import { Empty, Spin } from 'antd';
import message, { MessageType } from 'antd/lib/message';
import { Decimal } from 'components';
import { localeDate } from 'helpers';
import { useVoteHistoryFetch } from 'hooks';
import { selectVoteDonateLoading, selectVoteHistoryInfo, selectVoteListLoading } from 'modules';
import * as React from 'react';
import { useSelector } from 'react-redux';
// tslint:disable-next-line: no-empty-interface
interface VoteHistoryProps {}

export const VoteHistory: React.FC<VoteHistoryProps> = ({}) => {
	useVoteHistoryFetch();
	const voteHistoryInfo = useSelector(selectVoteHistoryInfo);
	const isVoteHistoryLoading = useSelector(selectVoteListLoading);
	const isVoteDonateLoading = useSelector(selectVoteDonateLoading);
	const msg = React.useRef<MessageType | null>(null);

	React.useEffect(() => {
		if (isVoteDonateLoading) {
			msg.current = message.loading('Progress..', 0);
		} else {
			if (msg.current) {
				msg.current();
			}
		}
	}, [isVoteDonateLoading]);

	const getBodyTableData = React.useCallback(() => {
		const rowDatas = voteHistoryInfo.data.map((vote, i) => {
			return [
				i + 1,
				vote.coin_id,
				vote.name,
				Decimal.formatRemoveZero(vote.amount, 20),
				localeDate(vote.created_at, 'fullDate'),
			];
		});

		return rowDatas;
	}, [voteHistoryInfo]);

	const dataTable = getBodyTableData();

	const emptyTableElm = (
		<tr>
			<td className="d-table-cell" colSpan={1000}>
				<div className="mb-5 mt-5">
					<Empty />
				</div>
			</td>
		</tr>
	);

	return (
		<div className="pg-vote__history">
			<div className="pg-vote__history__wrapper-table">
				<div className="pg-vote__history__navbar">
					<h2 className="pg-vote__history__navbar__title">Vote History</h2>
				</div>
				<div className="pg-vote__history__table__inner">
					<table className="pg-vote__history__table pg-vote__history__table--fixed">
						<thead>
							<tr>
								<th>Number</th>
								<th>Code</th>
								<th>Name</th>
								<th>Amount</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{dataTable.length
								? dataTable.map((row, i) => (
										<tr key={i}>
											{row.map((value, j) => (
												<td key={j}>{value}</td>
											))}
										</tr>
								  ))
								: emptyTableElm}
						</tbody>
					</table>
					{isVoteHistoryLoading && (
						<div className="pg-vote__data__inner--loading">
							<Spin size="large" />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
