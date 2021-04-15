import { Col, Empty, Menu, message, Row } from 'antd';
import * as React from 'react';
import { IEOItem } from '../../components';
import './SaleListTables.css'
import { activeSaleListFetch, upComingSaleListFetch, endedSaleListFetch, onGoingSaleListFetch, selectSaleList } from '../../../../../modules';
import { useDispatch, useSelector } from 'react-redux';


export const SaleListTables: React.FC = () => {


  // Dispatch Fetch Wallets Of User Action
  const dispatch = useDispatch();
  const dispatchActiveSaleListFetch = () => dispatch(activeSaleListFetch());
  const dispatchUpcomingSaleListFetch = () => dispatch(upComingSaleListFetch());
  const dispatchOnGoingSaleListFetch = () => dispatch(onGoingSaleListFetch());
  const dispatchEndedSaleListFetch = () => dispatch(endedSaleListFetch());

  let saleList = useSelector(selectSaleList);

  React.useEffect(() => {
    // Dispatch Active Sale List Fetch in one time
    dispatchActiveSaleListFetch();
  }, []);

  const handleSelectMenuItem = ({ key, domEvent }) => {
    switch (key) {
      case 'active':
        dispatchActiveSaleListFetch();
        break;
      case 'upcoming':
        dispatchUpcomingSaleListFetch();
        break;
      case 'ongoing':
        dispatchOnGoingSaleListFetch();
        break;
      case 'ended':
        dispatchEndedSaleListFetch();
        break;
      default:
        break;
    }
  }

  let saleItems;
  if (saleList.payload.length === 0) {
    saleItems =
      <div className="col-12 d-flex justify-content-center">
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{ marginTop: '3rem' }}
          description={
            <span>
              No available IEO
          </span>
          }
        />
      </div>
  } else {
    saleItems = [...saleList.payload].map((sale => {
      return (
        <Col span={24} key={sale.id}>
          <IEOItem key={sale.id} sale={sale} type={sale.type} />
        </Col>
      );
    }))
  }

  React.useEffect(() => {
    if (saleList.loading) {
      message.loading('', 0);
    } else {
      message.destroy();
    }

    return function cleanup() {
      message.destroy();
    }
  }, [saleList.loading]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Menu mode="horizontal" defaultSelectedKeys={['active']} onClick={handleSelectMenuItem}>
            <Menu.Item key="active"><span style={{ color: '#4284F5ff' }}>Active</span></Menu.Item>
            <Menu.Item key="ongoing"><span style={{ color: '#0C9D58ff' }}>On Going</span></Menu.Item>
            <Menu.Item key="upcoming"><span style={{ color: '#FABE08ff' }}>Up Coming</span></Menu.Item>
            <Menu.Item key="ended"><span style={{ color: '#EA4235ff' }}>Ended</span></Menu.Item>
          </Menu>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          {<Row gutter={[16, 16]}>{saleItems}</Row>}
        </div>
      </div>
    </div>
  )
}
