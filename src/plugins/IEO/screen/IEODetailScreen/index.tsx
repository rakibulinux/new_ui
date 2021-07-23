import * as React from 'react';
import { IEODetail, BuyIEOComponent, CautionsDetail, InformationIEO, BuyersHistory, BuyHistory } from './../../containers';
import { useHistory } from 'react-router';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectIEOItem, selectUserInfo, findIEOById } from '../../../../modules';

export const IEODetailScreen = () => {
	const history = useHistory();
	const { ieoID } = useParams<{ ieoID: string }>();
	const { loading, payload: IEOItem } = useSelector(selectIEOItem);
	const user = useSelector(selectUserInfo);
	const dispatch = useDispatch();
	const dispatchFetchIEOItemByID = (ieoIdParam: string) =>
		dispatch(
			findIEOById({
				id: ieoIdParam,
			}),
		);

	React.useEffect(() => {
		dispatchFetchIEOItemByID(ieoID);
	}, []);

	const LoadingSpinner = () => {
		return (
			<div className="loading-detail-ieo w-100 d-flex justify-content-center">
				<div className="spinner-border text-primary" role="status">
					<span className="sr-only">Loading...</span>
				</div>
			</div>
		);
	};
	console.log(IEOItem);
	const renderBuyHistoryView = () => {
		if (user.uid) {
			return (
				<div className="ieo-detail-screen__buy-history col-12 d-flex flex-wrap justify-content-center">
					<div className="buy-history-title col-12 text-center">
						<h3>Buy History</h3>
					</div>
					<div className="col-md-12 col-xl-6 mt-3">
						<BuyHistory ieoID={Number(ieoID)} uid={user.uid} />
					</div>
					<div className="col-md-12 col-xl-6 mt-3">
						<BuyersHistory ieoID={Number(ieoID)} />
					</div>
				</div>
			);
		}
		return (
			<div className="ieo-detail-screen__buy-history col-12 d-flex flex-wrap justify-content-center">
				<div className="buy-history-title col-12 text-center">
					<h3>Buy History</h3>
				</div>
				<div className="col-md-10 mt-3">
					<BuyersHistory ieoID={Number(ieoID)} />
				</div>
			</div>
		);
	};
	return (
		<div className="ieo-detail-screen">
			<div className="container ieo-detail-screen__header">
				<div className="row">
					<div className="col-12">
						<h3 className="ieo-detail-screen__header__title">IEO</h3>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<button
							className="ieo-detail-screen__header__return-btn"
							onClick={() => {
								history.goBack();
							}}
						>
							{`< Return To List`}
						</button>
					</div>
				</div>
			</div>

			<div className="container ieo-detail-screen__body">
				<div className="row">
					{loading ? (
						<LoadingSpinner />
					) : (
						<div className="d-flex flex-wrap justify-content-center">
							<div className="col-md-6" style={{ padding: '0 0.5rem 0 0' }}>
								<IEODetail
									endDate={IEOItem.end_date}
									startDate={IEOItem.start_date}
									bonus={IEOItem.bonus}
									currencyID={IEOItem.currency_id}
									remains={Number(IEOItem.remains)}
									total={Number(IEOItem.total_ieo)}
									progress={IEOItem.progress}
								/>
							</div>

							<div
								className="col-md-6 ieo-detail-screen__body__buy"
								style={{ backgroundColor: '#c', padding: '0 0.5rem 0 0' }}
							>
								<BuyIEOComponent
									coins={IEOItem.currency_available.length ? IEOItem.currency_available : ['']}
									currencyID={IEOItem.currency_id}
									priceIEO={Number(IEOItem.price)}
									type={IEOItem.type}
									minBuy={IEOItem.min_buy}
									uid={user.uid}
									id={ieoID}
									allBonus={IEOItem.allBonus}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-12 p-0 mt-3">
						{renderBuyHistoryView()}
						<CautionsDetail ieoID={Number(ieoID)} />
						<InformationIEO />
					</div>
				</div>
			</div>
		</div>
	);
};
