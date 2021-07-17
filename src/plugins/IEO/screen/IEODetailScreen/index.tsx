import * as React from 'react';
import { IEODetail, BuyIEOComponent, CautionsDetail, InformationIEO, BuyersHistory, BuyHistory } from './../../containers';
import { useHistory } from 'react-router';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectIEOItem, selectUserInfo, findIEOById } from '../../../../modules';

export const IEODetailScreen = () => {
	const history = useHistory();
	const { ieoID } = useParams<{ ieoID: string }>();
	const IEOItem = useSelector(selectIEOItem);
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

	const loadingDetailIEO = () => {
		return (
			<div className="loading-detail-ieo w-100 d-flex justify-content-center">
				<div className="spinner-border text-primary" role="status">
					<span className="sr-only">Loading...</span>
				</div>
			</div>
		);
	};
	const renderBuyHistoryView = () => {
		if (user.uid) {
			return (
				<div className="buy-history-view col-12 d-flex flex-wrap justify-content-center">
					<div className="buy-history-title col-12 text-center">
						<h3>Buy History</h3>
					</div>
					<div className="col-md-12 col-xl-6" style={{ marginTop: '36px' }}>
						<BuyHistory ieoID={Number(ieoID)} uid={user.uid} />
					</div>
					<div className="col-md-12 col-xl-6" style={{ marginTop: '36px' }}>
						<BuyersHistory ieoID={Number(ieoID)} />
					</div>
				</div>
			);
		}
		return (
			<div className="buy-history-view col-12 d-flex flex-wrap justify-content-center">
				<div className="buy-history-title col-12 text-center">
					<h3>Buy History</h3>
				</div>
				<div className="col-md-10" style={{ marginTop: '36px' }}>
					<BuyersHistory ieoID={Number(ieoID)} />
				</div>
			</div>
		);
	};
	return (
		<div id="ieo-detail-screen">
			<h3 className="ieo-title">IEO</h3>
			<button
				id="ioe-detail-screen__return-list"
				className="col-12"
				onClick={() => {
					history.goBack();
				}}
			>
				{`< Return To List`}
			</button>
			{IEOItem.loading ? (
				loadingDetailIEO()
			) : (
				<div id="ieo-detail-screen_container" className="d-flex flex-wrap justify-content-center">
					<div className="col-md-6" style={{ paddingLeft: '0px' }}>
						<IEODetail
							endDate={IEOItem.payload.end_date}
							startDate={IEOItem.payload.start_date}
							bonus={IEOItem.payload.bonus}
							currencyID={IEOItem.payload.currency_id}
						/>
					</div>

					<div className="col-md-6" style={{ backgroundColor: '#434A56', paddingRight: '0px' }}>
						<BuyIEOComponent
							coins={IEOItem.payload.currency_available.length ? IEOItem.payload.currency_available : ['']}
							currencyID={IEOItem.payload.currency_id}
							priceIEO={Number(IEOItem.payload.price)}
							type={IEOItem.payload.type}
							minBuy={IEOItem.payload.min_buy}
							uid={user.uid}
							id={ieoID}
							bonus={IEOItem.payload.bonus}
						/>
					</div>
					<div className="container-fluid col-12" style={{ padding: '0px', marginTop: '36px' }}>
						{renderBuyHistoryView()}
						<CautionsDetail />
						<InformationIEO />
					</div>
				</div>
			)}
		</div>
	);
};
