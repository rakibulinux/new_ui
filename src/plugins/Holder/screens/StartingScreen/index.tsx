import {
	fetchHolderList,
	getHolderInfo,
	selectHolderInfoData,
	selectHolderListData,
	selectHolderListLoading,
} from 'modules/plugins/holder';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { CountDownHolder } from '../../components';
import { toNumber } from 'lodash';
import { selectUserLoggedIn } from 'modules';
import { Link } from 'react-router-dom';

const NUMBER_ITEM_DISPLAY = 15;
const MINIMUM_HOLD_AMOUNT = 15000;

export const HolderStartingScreen = () => {
	// dispatch
	const dispatch = useDispatch();

	// selectors
	const holderList = useSelector(selectHolderListData);
	const isLoadingHolderList = useSelector(selectHolderListLoading);
	const holderInfo = useSelector(selectHolderInfoData);
	const isLogin = useSelector(selectUserLoggedIn);

	// state
	const [paginationState, setPaginationState] = React.useState(0);

	// side effects
	React.useEffect(() => {
		dispatch(fetchHolderList({ page: 0, limit: NUMBER_ITEM_DISPLAY }));
		dispatch(getHolderInfo());
	}, [dispatch]);

	const handleFriendsPageClick = (selectedItem: { selected: number }) => {
		setPaginationState(selectedItem.selected);
		dispatch(fetchHolderList({ page: selectedItem.selected, limit: NUMBER_ITEM_DISPLAY }));
	};

	const renderHolderInfo = () => {
		if (isLogin) {
			return (
				<React.Fragment>
					{holderInfo && toNumber(holderInfo.amount) > MINIMUM_HOLD_AMOUNT ? (
						<h2>
							✔️ Your balance is larger than {MINIMUM_HOLD_AMOUNT} CX.
							<br />
							<br />
							✔️ You have qualified to participate in the program{' '}
						</h2>
					) : (
						<h2>
							👉 Your balance must be larger than {MINIMUM_HOLD_AMOUNT} CX.
							<br />
							<br />❌ You have not qualified to participate in the program.
						</h2>
					)}

					{holderInfo ? (
						<h2>
							Your amount: <strong>{holderInfo.amount} CX</strong>
						</h2>
					) : null}
				</React.Fragment>
			);
		}
		return (
			<h2>
				👉 Please <Link to="/login">login in</Link> Circle Exchange.
			</h2>
		);
	};

	return (
		<div className="container desktop-holder-starting-screen">
			<div className="row desktop-holder-starting-screen__header">
				<div className="col-6 desktop-holder-starting-screen__header__total-profit">
					<div>
						<h3 className="desktop-holder-starting-screen__header__total-profit__title">Total Profit</h3>
					</div>
					<div>
						<h4 className="desktop-holder-starting-screen__header__total-profit__subtitle">0</h4>
					</div>
				</div>
				<div className="col-6 desktop-holder-starting-screen__header__total-holder">
					<div>
						<h3 className="desktop-holder-starting-screen__header__total-holder__title">Total Holder</h3>
					</div>
					<div>
						<h4 className="desktop-holder-starting-screen__header__total-holder__subtitle">{holderList[0]}</h4>
					</div>
				</div>
			</div>
			<div className="row mt-3">
				<div className="col-12">
					<CountDownHolder />
				</div>
			</div>
			<div className="row mt-3">
				<div className="col-12">
					<div className="desktop-holder-starting-screen__info">{renderHolderInfo()}</div>
				</div>
				<div className="col-12">
					<table className="desktop-holder-starting-screen__table">
						<thead>
							<tr>
								<th>STT</th>
								<th>UID</th>
								<th>Amount</th>
							</tr>
						</thead>
						<tbody>
							{holderList[1].length > 0
								? holderList[1].map((holder, i) => (
										<tr key={holder.uid}>
											<td>{i + 1 + paginationState * NUMBER_ITEM_DISPLAY}</td>
											<td>{holder.uid}</td>
											<td>{holder.amount}</td>
										</tr>
								  ))
								: null}
						</tbody>

						{isLoadingHolderList ? (
							<div className="desktop-holder-starting-screen__table__loading">
								<div className="text-center" style={holderList[1].length === 0 ? { paddingTop: '3rem' } : {}}>
									<div className="spinner-border" role="status">
										<span className="sr-only">Loading...</span>
									</div>
								</div>
							</div>
						) : null}
					</table>
					{!isLoadingHolderList && holderList[1].length <= 0 ? (
						<div className="desktop-holder-starting-screen__table__empty">
							<div>
								<svg
									enable-background="new 0 0 32 32"
									height="80"
									viewBox="0 0 32 32"
									width="80"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="m26 32h-20c-3.314 0-6-2.686-6-6v-20c0-3.314 2.686-6 6-6h20c3.314 0 6 2.686 6 6v20c0 3.314-2.686 6-6 6z"
										fill="#f5e6fe"
									/>
									<path
										d="m23.939 16.221-2.642-5.725c-.326-.706-1.038-1.162-1.816-1.162h-6.96c-.778 0-1.491.456-1.816 1.162l-2.643 5.725c-.041.087-.062.183-.062.279v4.167c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-4.167c0-.096-.021-.192-.061-.279zm-12.024-5.167c.108-.235.346-.387.605-.387h6.96c.259 0 .497.152.605.387l2.283 4.946h-1.373c-.519 0-.968.334-1.117.831l-.715 2.383c-.021.071-.085.119-.16.119h-6.008c-.074 0-.138-.048-.16-.119l-.715-2.382c-.148-.498-.597-.832-1.116-.832h-1.372z"
										fill="#be63f9"
									/>
								</svg>
							</div>
							<h5 className="mt-3">List is empty</h5>
						</div>
					) : null}
				</div>
			</div>
			<div className="row mt-3">
				<div className="col-12 d-flex justify-content-center">
					{isLoadingHolderList ? null : (
						<ReactPaginate
							previousLabel={'<'}
							nextLabel={'>'}
							breakLabel={'...'}
							breakClassName={'break-me'}
							pageCount={holderList[0] / NUMBER_ITEM_DISPLAY}
							marginPagesDisplayed={2}
							pageRangeDisplayed={NUMBER_ITEM_DISPLAY}
							onPageChange={handleFriendsPageClick}
							containerClassName={'td-referral-content__table-pagination'}
							activeClassName={'active'}
							forcePage={paginationState}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
