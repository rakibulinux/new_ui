import * as React from 'react';
import { message } from 'antd';
import { IEODetail, BuyIEOComponent, CautionsDetail, InformationIEO, BuyersHistory, BuyHistory } from './../../containers';
import { useHistory } from 'react-router';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectIEOItem, selectUserInfo, findIEOById } from '../../../../modules';

export const IEODetailScreen = () => {
	const history = useHistory();
	const { ieoID } = useParams<{ ieoID: string }>();
	const IEOItem = useSelector(selectIEOItem);
	const [resetFetchHistoryIEO, setResetFetchHistoryIEO] = React.useState<boolean>(false);

	const disableResetFetchHistory = () => {
		setResetFetchHistoryIEO(false);
	};
	// const enableResetFetchHistory = () => {
	// 	setResetFetchHistoryIEO(true);
	// };
	const user = useSelector(selectUserInfo);
	const dispatch = useDispatch();
	const dispatchFetchIEOItemByID = (ieoIdParam: string) =>
		dispatch(
			findIEOById({
				id: ieoIdParam,
			}),
		);
	React.useEffect(() => {
		if (IEOItem.loading) {
			message.loading('Waiting a seconds...', 0);
		} else {
			message.destroy();
		}
		return () => {
			message.destroy();
		};
	}, [IEOItem.loading]);
	React.useEffect(() => {
		dispatchFetchIEOItemByID(ieoID);
	}, []);

	const renderBuyHistoryView = () => {
		if (user.uid) {
			return (
				<div className="buy-history-view col-12 d-flex flex-wrap justify-content-center">
					<div className="buy-history-title col-12 text-center">
						<h3>Buy History</h3>
					</div>
					<div className="col-md-12 col-xl-6" style={{ paddingRight: '15px', marginTop: '36px' }}>
						<BuyHistory
							disableResetFetchHistory={disableResetFetchHistory}
							reset={resetFetchHistoryIEO}
							ieoID={Number(ieoID)}
							uid={user.uid}
						/>
					</div>
					<div className="col-md-12 col-xl-6" style={{ paddingLeft: '0px', marginTop: '36px' }}>
						<BuyersHistory
							disableResetFetchHistory={disableResetFetchHistory}
							reset={resetFetchHistoryIEO}
							ieoID={Number(ieoID)}
							// uid={user.uid}
						/>
					</div>
				</div>
			);
		}
		return (
			<div className="buy-history-view col-12 d-flex flex-wrap justify-content-center">
				<div className="buy-history-title col-12 text-center">
					<h3>Buy History</h3>
				</div>
				<div className="col-md-10" style={{ paddingLeft: '0px', marginTop: '36px' }}>
					<BuyersHistory
						disableResetFetchHistory={disableResetFetchHistory}
						reset={resetFetchHistoryIEO}
						ieoID={Number(ieoID)}
					/>
				</div>
			</div>
		);
	};
	return (
		<React.Fragment>
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
					<></>
				) : (
					<div id="ieo-detail-screen_container" className="d-flex flex-wrap justify-content-center">
						<div className="col-md-6">
							<IEODetail
								endDate={IEOItem.payload.end_date}
								startDate={IEOItem.payload.start_date}
								bonus={IEOItem.payload.bonus}
								currencyID={IEOItem.payload.currency_id}
							/>
						</div>

						<div className="col-md-6" style={{ backgroundColor: '#434A56' }}>
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
						<div className="container-fluid col-12" style={{ paddingRight: '0px', marginTop: '36px' }}>
							{renderBuyHistoryView()}
							<CautionsDetail />
							<InformationIEO />
						</div>
					</div>
				)}
			</div>
		</React.Fragment>
	);
};
