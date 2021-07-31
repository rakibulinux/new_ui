import { Empty, Spin } from 'antd';
import { NewPagination } from 'components';
import { useVoteDonateFreeFetch, useVoteListFetch, useWalletsFetch } from 'hooks';
import get from 'lodash/get';
import { selectVoteListInfo, selectVoteListLoading, selectWallets } from 'modules';
import * as constants from 'plugins/constants/vote';
import { ButtonVote, CountDownVote } from 'plugins/Vote/components';
import * as React from 'react';
import isEqual from 'react-fast-compare';
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
	const freeVote = useVoteDonateFreeFetch();
	const [pagination, setPagintion] = React.useState(defaultPaginationState);
	const [keyword, setKeyword] = React.useState('');
	const voteListInfo = useSelector(selectVoteListInfo);
	const isVoteListLoading = useSelector(selectVoteListLoading);
	const wallet = useSelector(selectWallets, isEqual).find(
		walletParam => walletParam.currency === constants.VOTE_CURRENCIE.toLowerCase(),
	);

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
	const availableVote = wallet && wallet.balance ? Math.floor(+wallet.balance / constants.VOTE_RATE) : 0;
	const availableFreeVote = freeVote.total ? Math.floor((freeVote.total - freeVote.used) / constants.VOTE_RATE) : 0;

	return (
		<div className="pg-vote__news">
			<div className="pg-vote--border pg-vote__news__title">
				<p>
					Every 10 days we pick the most voted coin. Only one coin is selected. 1 vote = {constants.VOTE_RATE}{' '}
					{constants.VOTE_CURRENCIE.toUpperCase()}. Minimum 10,000 votes required to be considered.
				</p>
				<p>
					You can buy CX on <Link to="/market/cxusdt">CX Exchange</Link> or{' '}
					<a
						href="https://app.uniswap.org/#/swap?outputCurrency=0x3f4e02741b155f5ce8d6190d294d4f916125b896&use=V2"
						target="blank"
					>
						Uniswap
					</a>
				</p>
			</div>
			<CountDownVote />
			<div className="pg-vote--border pg-vote__news__wrapper-table">
				<div className="pg-vote__news__navbar">
					<div className="d-flex justify-space-between">
						<div className="d-flex flex-fill  mb-2">
							<h4 className="pg-vote__news__navbar__title m-0">New Coins</h4>
							<div className="d-flex flex-column justify-content-center ml-3">
								<div>
									<span>
										Balance {constants.VOTE_CURRENCIE} : {+get(wallet, 'balance', 0)}
									</span>{' '}
									- <span>Available vote : {availableVote}</span>
								</div>
								<div>
									<span>Free : {availableFreeVote}</span> -{' '}
									<span>Total : {availableVote + availableFreeVote}</span>
								</div>
							</div>
						</div>
						<a href="https://forms.gle/2eH6ia3XSTyzn2TR6" target="_blank">
							<button type="button" className="pg-vote__news--radius btn btn-success">
								Submit Vote Coin
							</button>
						</a>
					</div>
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
