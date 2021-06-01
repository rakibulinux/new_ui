import { Empty } from 'antd';
import { NewPagination } from 'components';
import { useVoteListFetch } from 'hooks';
import { selectUserLoggedIn, selectVoteListInfo } from 'modules';
import * as React from 'react';
import { Button, Container, Overlay, Tooltip } from 'react-bootstrap';
import isEqual from 'react-fast-compare';
import { ImPlus } from 'react-icons/im';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

interface ButtonVoteProps {
	quantity: number;
	idKey: number;
}

const ButtonVote: React.FC<ButtonVoteProps> = props => {
	const { quantity } = props;
	const intl = useIntl();
	const userLoggedIn = useSelector(selectUserLoggedIn, isEqual);
	const [show, setShow] = React.useState(false);
	const target = React.useRef(null);

	const onHandleClick = () => {
		if (!userLoggedIn) {
			setShow(!show);
		}
	};

	return (
		<>
			<Button ref={target} onClick={onHandleClick} variant="outline-dark">
				<span>{quantity}</span> <ImPlus className="ml-2" />
			</Button>
			<Overlay target={target.current} show={show} placement="left">
				{propOverlays => (
					<Tooltip id={`overlay-vote-button-${props.idKey}`} {...propOverlays}>
						You are not logged in. <Link to="/login"> {intl.formatMessage({ id: 'page.body.user.loggin' })}</Link>
					</Tooltip>
				)}
			</Overlay>
		</>
	);
};

// tslint:disable-next-line: no-empty-interface
interface VoteScreenProps {}

const defaultPaginationState = {
	pageIndex: 1,
	limit: 10,
};

export const VoteScreen: React.FC<VoteScreenProps> = ({}) => {
	const [pagination, setPagintion] = React.useState(defaultPaginationState);
	const voteListInfo = useSelector(selectVoteListInfo);

	useVoteListFetch(pagination);

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
				<ButtonVote idKey={i} quantity={vote.total} />,
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
		<div className="pg-vote">
			<Container>
				<div className="pg-vote__title">
					Every Wednesday we pick the most voted coin. Only one coin is selected. 1 vote = 1 CX. You can buy CX here.
					Minimum 250000 votes required to be considered. Votes are cumulative from week to week.
					<p>
						Click <a href="/">here</a> to add your coin!
					</p>
				</div>
				<div className="pg-vote__wrapper-table">
					<div className="pg-vote__navbar">
						<h2 className="pg-vote__navbar__title">New Coins</h2>
						<input className="pg-vote__navbar__input-search mt-2" placeholder="search" />
					</div>
					<div className="pg-vote__table__inner">
						<table className="pg-vote__table">
							<thead>
								<tr>
									<th>Rank</th>
									<th>Code</th>
									<th>Name</th>
									<th>Website</th>
									<th>Votes</th>
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
									: null}
							</tbody>
						</table>
						{!dataTable.length && (
							<div className="mb-5 mt-5">
								<Empty />
							</div>
						)}
					</div>
				</div>
				<NewPagination
					page={pagination.pageIndex}
					total={Math.ceil(voteListInfo.total / pagination.limit)}
					toPage={onToPage}
				/>
			</Container>
		</div>
	);
};
