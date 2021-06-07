import { Empty } from 'antd';
import { NewPagination } from 'components';
import { useVoteListFetch, useWalletsFetch } from 'hooks';
import { alertPush, selectUserInfo, selectUserLoggedIn, selectVoteListInfo, selectWallets, voteDonateCreate } from 'modules';
import * as constants from 'plugins/constants/vote';
import * as React from 'react';
import { Button, Container, Form, FormControlProps, Overlay, Tooltip } from 'react-bootstrap';
import isEqual from 'react-fast-compare';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { ImPlus } from 'react-icons/im';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

interface ButtonVoteProps {
	quantity: number;
	idKey: number;
	id: string;
}

const ButtonVote: React.FC<ButtonVoteProps> = props => {
	const { quantity, id } = props;
	const dispatch = useDispatch();
	const intl = useIntl();
	const userLoggedIn = useSelector(selectUserLoggedIn, isEqual);
	const wallet = useSelector(selectWallets, isEqual).find(
		walletParam => walletParam.currency === constants.VOTE_CURRENCIE.toLowerCase(),
	);
	const user = useSelector(selectUserInfo, isEqual);
	const [show, setShow] = React.useState(false);
	const [amount, setAmount] = React.useState<number>();
	const target = React.useRef(null);

	const onToggleShow = () => {
		setShow(!show);
	};

	const changeAmount: FormControlProps['onChange'] = e => {
		setAmount(Number(e.target.value) || undefined);
	};

	const pushNotification = (message: string) => {
		dispatch(
			alertPush({
				message: [message],
				type: 'success',
			}),
		);
	};

	const onAccept = () => {
		if (wallet) {
			if (wallet.balance) {
				if ((amount || 0) > +wallet.balance) {
					pushNotification(`Amount(${amount}) must be less than wallet balance(${wallet.balance})`);
				} else {
					dispatch(
						voteDonateCreate({
							id,
							amount: Number(amount),
						}),
					);
					onToggleShow();
					setAmount(undefined);
				}
			} else {
				pushNotification(`You don't have ${constants.VOTE_CURRENCIE} wallet balance yet`);
			}
		} else {
			pushNotification(`You don't have ${constants.VOTE_CURRENCIE} wallet`);
		}
	};

	const titleTooltip = () => {
		if (!userLoggedIn) {
			return (
				<>
					You are not logged in. <Link to="/login"> {intl.formatMessage({ id: 'page.body.user.loggin' })}</Link>
				</>
			);
		} else if (!user.otp) {
			return (
				<>
					You have not enabled 2FA. <Link to="/profile"> to Profile</Link>
				</>
			);
		}

		return (
			<div className="d-flex">
				<Form.Control
					className="h-100"
					size="sm"
					type="number"
					placeholder="Amount"
					value={amount}
					onChange={changeAmount}
				/>
				<button
					className="pg-vote__table__tbody__button-vote__overlay-input__accept"
					disabled={!amount}
					onClick={onAccept}
				>
					<FaCheck size="10" />
				</button>
				<button className="pg-vote__table__tbody__button-vote__overlay-input__close" onClick={onToggleShow}>
					<FaTimes size="10" />
				</button>
			</div>
		);
	};

	return (
		<div className="pg-vote__table__tbody__button-vote">
			<Button ref={target} onClick={onToggleShow} variant="outline-dark">
				<span>{quantity}</span> <ImPlus className="ml-2" />
			</Button>
			<Overlay target={target.current} show={show} placement="left">
				{propOverlays => (
					<Tooltip
						className="pg-vote__table__tbody__button-vote__overlay-input"
						id={`overlay-vote-button-${props.idKey}`}
						{...propOverlays}
					>
						{titleTooltip()}
					</Tooltip>
				)}
			</Overlay>
		</div>
	);
};

// tslint:disable-next-line: no-empty-interface
interface VoteScreenProps {}

const defaultPaginationState = {
	pageIndex: 1,
	limit: 10,
};

export const VoteScreen: React.FC<VoteScreenProps> = ({}) => {
	useWalletsFetch();
	const [pagination, setPagintion] = React.useState(defaultPaginationState);
	const [keyword, setKeyword] = React.useState('');
	const voteListInfo = useSelector(selectVoteListInfo);
	useVoteListFetch({ ...pagination, keyword });

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
		<div className="pg-vote">
			<Container>
				<div className="pg-vote__title">
					Every Wednesday we pick the most voted coin. Only one coin is selected. 1 vote = 1 {constants.VOTE_CURRENCIE}.
					Minimum 250000 votes required to be considered. Votes are cumulative from week to week.
					<p>
						Click <Link to={`/wallets/deposit/${constants.VOTE_CURRENCIE}`}>here</Link> to add your coin!
					</p>
				</div>
				<div className="pg-vote__wrapper-table">
					<div className="pg-vote__navbar">
						<h2 className="pg-vote__navbar__title">New Coins</h2>
						<input
							className="pg-vote__navbar__input-search mt-2"
							placeholder="search"
							value={keyword}
							onChange={onChangeKeyword}
						/>
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
							<tbody className="pg-vote__table__tbody">
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
