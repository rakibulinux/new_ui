import { fetchHolderList, selectHolderListData } from 'modules/plugins/holder';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const HolderStartingScreen = () => {
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(fetchHolderList());
	}, []);

	const holderList = useSelector(selectHolderListData);
	const isLoadingHolderList = useSelector(selectHolderListData);

	console.log(holderList, isLoadingHolderList);

	return (
		<div className="container desktop-holder-starting-screen">
			<div className="row desktop-holder-starting-screen__header">
				<div className="col-6 desktop-holder-starting-screen__header__total-profit">
					<div>
						<h3 className="desktop-holder-starting-screen__header__total-profit__title">Total Profit</h3>
					</div>
					<div>
						<h4 className="desktop-holder-starting-screen__header__total-profit__subtitle">100</h4>
					</div>
				</div>
				<div className="col-6 desktop-holder-starting-screen__header__total-holder">
					<div>
						<h3 className="desktop-holder-starting-screen__header__total-holder__title">Total Holder</h3>
					</div>
					<div>
						<h4 className="desktop-holder-starting-screen__header__total-holder__subtitle">100</h4>
					</div>
				</div>
			</div>
			<div className="row">
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
							{holderList.map((holder, i) => (
								<tr>
									<td>{i + 1}</td>
									<td>{holder.uid}</td>
									<td>{holder.amount}</td>
								</tr>
							))}
						</tbody>
						{isLoadingHolderList ? (
							<div className="desktop-holder-starting-screen__table__loading">
								<div className=" text-center">
									<div className="spinner-border" role="status">
										<span className="sr-only">Loading...</span>
									</div>
								</div>
							</div>
						) : null}
					</table>
				</div>
			</div>
		</div>
	);
};
