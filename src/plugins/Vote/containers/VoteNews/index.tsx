import { Empty, Spin } from 'antd';
import { NewPagination } from 'components';
import { useVoteListFetch, useWalletsFetch } from 'hooks';
import { selectVoteListInfo, selectVoteListLoading } from 'modules';
import * as constants from 'plugins/constants/vote';
import { ButtonVote, CountDownVote } from 'plugins/Vote/components';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// tslint:disable-next-line: no-empty-interface
interface VoteNewsProps {}

const defaultPaginationState = {
	pageIndex: 1,
	limit: 10,
};

export const VoteNews: React.FC<VoteNewsProps> = ({}) => {
	useWalletsFetch();
	const [pagination, setPagintion] = React.useState(defaultPaginationState);
	const [keyword, setKeyword] = React.useState('');
	const voteListInfo = useSelector(selectVoteListInfo);
	const isVoteListLoading = useSelector(selectVoteListLoading);

	useVoteListFetch({ ...pagination, keyword });

	React.useEffect(() => {
		setPagintion(prev => ({ ...prev, pageIndex: defaultPaginationState.pageIndex }));
	}, [keyword]);

	const onChangeKeyword: React.InputHTMLAttributes<HTMLInputElement>['onChange'] = e => {
		setKeyword(e.target.value);
	};

	const getBodyTableData = React.useCallback(() => {
		const getRankData = (i: number) => (i <= 2 && pagination.pageIndex === 1 ? (i + 1).toString() : '');
		const rowDatas = voteListInfo.data.map((vote, i) => {
			return [
				getRankData(i),
				vote.id,
				vote.name,
				<a href={vote.website} target="_blank">
					{vote.website}
				</a>,
				<ButtonVote idKey={i} quantity={vote.total} id={vote.id} />,
			];
		});

		return rowDatas;
	}, [voteListInfo]);

	const onToPage = (pageIndex: number) => {
		setPagintion({
			...pagination,
			pageIndex,
		});
	};

	const dataTable = getBodyTableData();

	return (
		<div className="pg-vote__news">
			<div className="pg-vote--border pg-vote__news__title">
				Every Wednesday we pick the most voted coin. Only one coin is selected. 1 vote = 1{' '}
				{constants.VOTE_CURRENCIE.toUpperCase()}. Minimum 250000 votes required to be considered. Votes are cumulative
				from week to week.
				<p>
					Click <Link to={`/wallets/deposit/${constants.VOTE_CURRENCIE}`}>here</Link> to add your coin!
				</p>
			</div>
			<CountDownVote />
			<div className="pg-vote--border pg-vote__news__wrapper-table">
				<div className="pg-vote__news__navbar">
					<h2 className="pg-vote__news__navbar__title">New Coins</h2>
					<input
						className="pg-vote__news__navbar__input-search mt-2"
						placeholder="search"
						value={keyword}
						onChange={onChangeKeyword}
					/>
				</div>
				<div className="pg-vote__news__table__inner">
					<table className="pg-vote__news__table">
						<thead>
							<tr>
								<th>Rank</th>
								<th>Code</th>
								<th>Name</th>
								<th>Website</th>
								<th>Votes</th>
							</tr>
						</thead>
						<tbody className="pg-vote__news__table__tbody">
							{dataTable.length
								? dataTable.map((row, i) => (
										<tr key={i}>
											{row.map((value, j) => (
												<td key={j}>{value}</td>
											))}
										</tr>
								  ))
								: null}
						</tbody>
					</table>
					{isVoteListLoading && (
						<div className="pg-vote__data__inner--loading">
							<Spin size="large" />
						</div>
					)}
					{!dataTable.length && (
						<div className="mb-5 mt-5">
							<Empty />
						</div>
					)}
				</div>
				<NewPagination
					page={pagination.pageIndex}
					total={Math.ceil(voteListInfo.total / pagination.limit) || 1}
					toPage={onToPage}
				/>
			</div>
		</div>
	);
};
