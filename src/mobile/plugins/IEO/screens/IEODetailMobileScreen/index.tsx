import * as React from 'react';
import { useHistory, useParams } from 'react-router';
import { SaleInfo, SaleBuy, SaleSocial, BuyersHistory, BuyHistory } from '../../containers';
import './IEODetailMobileScreen.css';
import { findSalebyId, selectSaleItem, selectUserInfo } from '../../../../../modules';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, message, Result, Row } from 'antd';

export const IEODetailMobileScreen: React.FC = () => {
    const history = useHistory();
    const { ieoID } = useParams<{ ieoID: string }>();
    const saleItem = useSelector(selectSaleItem);
    const user = useSelector(selectUserInfo);
    const dispatch = useDispatch();
    const dispatchFetchSaleItemByID = (ieoID) => dispatch(findSalebyId({
        id: ieoID
    }));

    React.useEffect(() => {
        if (saleItem.loading) {
            message.loading('Waiting a seconds...', 0);
        } else {
            message.destroy();
        }
        return function cleanup() {
            message.destroy();
        }
    }, [saleItem.loading]);

    React.useEffect(() => {
        dispatchFetchSaleItemByID(ieoID);
    }, []);

    let saleInfoView, saleBuyView, saleSocialView, buyHistoryView;
    if (saleItem && user) {
        saleInfoView = <SaleInfo ieoID={ieoID} sale={saleItem.payload} />;
        saleBuyView = <SaleBuy uid={user.uid} sale={saleItem.payload} />;
        if (user.uid) {
            buyHistoryView =
                <>
                    <div className="col-12">
                        <BuyHistory uid={user.uid} ieoID={Number(ieoID)} />
                    </div>
                    <div className="col-12 mt-3">
                        <BuyersHistory ieoID={Number(ieoID)} />
                    </div>
                </>
        } else {
            buyHistoryView =
                <>
                    <div className="col-12">
                        <BuyersHistory ieoID={Number(ieoID)} />
                    </div>
                </>
        }

        const saleSocial = saleItem.payload.social;
        saleSocialView =
            <SaleSocial
                website={saleSocial.website}
                whitepaper={saleSocial.whitepaper}
                ico={saleSocial.ico}
                facebook={saleSocial.facebook}
                telegram={saleSocial.telegram}
                twitter={saleSocial.twitter}
                linkedin={saleSocial.linkedin}
                instagram={saleSocial.instagram}
            />;
    }

    const getBadgeColor = (type) => {
        switch (type) {
            case 'ongoing':
                return '#2a9d8f'
            case 'upcoming':
                return '#e9c46a';
            case 'ended':
                return '#e63946';
            default:
                return '#0C9D58ff';
        }
    }

    const renderDetailScreenView = () => {
        if (!saleItem.payload.id) {
            return (
                <Result
                    status="500"
                    title="500"
                    subTitle="Sorry, something went wrong. Not found IEO"
                    extra={<Button type="primary" onClick={() => history.goBack()}>Go Back</Button>}
                />
            );
        }
        else {
            return (
                <div id="sale-detail-mobile-screen">
                    <div id="sale-info-buy-mobile" className="container-fluid">
                        <span className="sale-detail-mobile__badge" style={{ backgroundColor: getBadgeColor(saleItem.payload.type) }}>{saleItem.payload ? saleItem.payload.type : ''}</span>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>{saleBuyView}</Col>
                            <Col span={24}>{saleInfoView}</Col>
                        </Row>

                    </div>
                    <div id="sale-history-mobile" className="container-fluid">
                        <div className="row">
                            {buyHistoryView}
                        </div>
                    </div>
                    <div id="sale-social-mobile" className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                {saleSocialView}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <React.Fragment>
            {renderDetailScreenView()}
        </React.Fragment>
    )
}
