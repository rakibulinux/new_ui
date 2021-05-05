import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { OpenOrders as OpenOrdersCpn } from '../../../../components';
import { localeDate, preciseData, setTradeColor } from '../../../../helpers';
import { openOrdersCancelFetch, selectCurrentMarket, selectOpenOrdersList } from '../../../../modules';
import { OrderCommon } from '../../../../modules/types';

// tslint:disable-next-line: no-empty-interface
interface OpenOrderProps {}

export const OpenOrders: React.FC<OpenOrderProps> = ({}) => {
  const dispatch = useDispatch();
  const currentMarket = useSelector(selectCurrentMarket);
  const list = useSelector(selectOpenOrdersList);

  const intl = useIntl();

  const renderHeadersKeys = () => {
    return ['Date', 'Price', 'Amount', 'Total', 'Filled', ''];
  };

  const renderHeaders = () => {
    const currentAskUnit = currentMarket ? ` (${currentMarket.base_unit.toUpperCase()})` : '';
    const currentBidUnit = currentMarket ? ` (${currentMarket.quote_unit.toUpperCase()})` : '';

    return [
      intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.date' }),
      intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.price' }).concat(currentBidUnit),
      intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.amount' }).concat(currentAskUnit),
      intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.total' }).concat(currentBidUnit),
      intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.filled' }),
      '',
    ];
  };

  const renderData = () => {
    if (list.length === 0) {
      return [[[''], [''], intl.formatMessage({ id: 'page.noDataToShow' })]];
    }

    return list.map((item: OrderCommon) => {
      const { id, price, created_at, remaining_volume, origin_volume, side } = item;
      const executedVolume = Number(origin_volume) - Number(remaining_volume);
      const remainingAmount = Number(remaining_volume);
      const total = Number(origin_volume) * Number(price);
      const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);
      const priceFixed = currentMarket ? currentMarket.price_precision : 0;
      const amountFixed = currentMarket ? currentMarket.amount_precision : 0;

      return [
        localeDate(created_at, 'fullDate'),
        <span style={{ color: setTradeColor(side).color }} key={id}>
          {preciseData(price, priceFixed)}
        </span>,
        <span style={{ color: setTradeColor(side).color }} key={id}>
          {preciseData(remainingAmount, amountFixed)}
        </span>,
        <span style={{ color: setTradeColor(side).color }} key={id}>
          {preciseData(total, amountFixed)}
        </span>,
        <span style={{ color: setTradeColor(side).color }} key={id}>
          {filled}%
        </span>,
        side,
      ];
    });
  };

  const handleCancel = (index: number) => {
    const orderToDelete = list[index];
    dispatch(openOrdersCancelFetch({ order: orderToDelete, list }));
  };

  return (
    <OpenOrdersCpn headersKeys={renderHeadersKeys()} headers={renderHeaders()} data={renderData()} onCancel={handleCancel} />
  );
};
