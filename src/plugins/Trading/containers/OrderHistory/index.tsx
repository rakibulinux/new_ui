import classnames from 'classnames';
import Tabs, { TabPane, TabsProps } from 'rc-tabs';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { CloseIcon } from '../../../../assets/images/CloseIcon';
import { ordersCancelAllFetch, selectCurrentMarket, selectOpenOrdersFetching, selectOpenOrdersList } from '../../../../modules';
import { OpenOrders } from './OpenOrders';
import { OrderHistoryStyle } from './styles';

// tslint:disable-next-line: no-empty-interface
interface OrderHistoryProps {}

export const OrderHistory: React.FC<OrderHistoryProps> = ({}) => {
  const dispatch = useDispatch();
  const fetching = useSelector(selectOpenOrdersFetching);
  const currentMarket = useSelector(selectCurrentMarket);
  const list = useSelector(selectOpenOrdersList);

  const intl = useIntl();

  const [tabKeyActiveState, setTabKeyActiveState] = React.useState<string>(
    intl.formatMessage({ id: 'page.body.trade.header.openOrders' }),
  );

  const tabsInfo = [
    {
      label: intl.formatMessage({ id: 'page.body.trade.header.openOrders' }),
      render: () => {
        const classNames = classnames('td-open-orders', {
          'td-open-orders--empty': !list.length,
          'td-open-orders--loading': fetching,
        });

        return tabKeyActiveState === intl.formatMessage({ id: 'page.body.trade.header.openOrders' }) ? (
          fetching ? (
            <div className="open-order-loading">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <div className={classNames}>
              <OpenOrders />
            </div>
          )
        ) : null;
      },
    },
  ];

  const handleOnchangeTab: TabsProps['onChange'] = (key) => {
    setTabKeyActiveState(key);
  };

  const handleCancelAll = () => {
    currentMarket && dispatch(ordersCancelAllFetch({ market: currentMarket.id }));
  };

  return (
    <OrderHistoryStyle>
      <Tabs
        defaultActiveKey="1"
        onChange={handleOnchangeTab}
        tabBarExtraContent={
          <span className="td-open-orders-tabs__cancel" onClick={handleCancelAll}>
            <FormattedMessage id="page.body.openOrders.header.button.cancelAll" />
            <CloseIcon className="td-open-orders-tabs__close" />
          </span>
        }
      >
        {tabsInfo.map((item) => (
          <TabPane tab={item.label} key={item.label}>
            {item.render()}
          </TabPane>
        ))}
      </Tabs>
    </OrderHistoryStyle>
  );
};
