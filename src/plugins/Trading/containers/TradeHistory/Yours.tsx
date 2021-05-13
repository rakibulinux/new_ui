import classNames from 'classnames';
import get from 'lodash/get';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Decimal } from '../../../../components';
import { localeDate } from '../../../../helpers';
import {
  fetchHistory,
  selectCurrentMarket,
  selectCurrentPrice,
  selectHistory,
  selectHistoryLoading,
  setCurrentPrice,
  WalletHistoryElement,
} from '../../../../modules';
import { Table } from '../../components/Table';
import { handleHighlightValue } from './Market';

const timeFrom = String(Math.floor((Date.now() - 1000 * 60 * 60 * 24) / 1000));

const RecentTradesYoursContainer: React.FC = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const list = useSelector(selectHistory, isEqual);
  const fetching = useSelector(selectHistoryLoading, isEqual);
  const currentMarket = useSelector(selectCurrentMarket, isEqual);
  const currentPrice = useSelector(selectCurrentPrice, isEqual);

  React.useEffect(() => {
    if (currentMarket) {
      dispatch(fetchHistory({ type: 'trades', page: 0, time_from: timeFrom, market: currentMarket.id }));
    }
  }, [currentMarket]);

  const getHeaders = () => {
    const titleColPrice = `${intl.formatMessage({ id: 'page.body.trade.header.recentTrades.content.price' })}${
      currentMarket ? `(${currentMarket.quote_unit.toUpperCase()})` : ''
    }`;
    const titleColAmount = `${intl.formatMessage({ id: 'page.body.trade.header.recentTrades.content.amount' })}${
      currentMarket ? `(${currentMarket.base_unit.toUpperCase()})` : ''
    }`;
    const titleColTime = intl.formatMessage({ id: 'page.body.trade.header.recentTrades.content.time' });

    return [titleColPrice, titleColAmount, titleColTime];
  };

  const retrieveData = () => {
    return [...list].length > 0 ? [...list].map(renderRow) : [[[''], intl.formatMessage({ id: 'page.noDataToShow' }), ['']]];
  };

  const renderRow = (item: WalletHistoryElement, i: number) => {
    const { id, created_at, price, amount } = item;
    const side = get(item, 'side') as string;
    const priceFixed = currentMarket ? currentMarket.price_precision : 0;
    const amountFixed = currentMarket ? currentMarket.amount_precision : 0;
    const higlightedDate = handleHighlightValue(
      String(localeDate([...list][i - 1] ? [...list][i - 1].created_at : '', 'time')),
      String(localeDate(created_at, 'time')),
    );

    const isPositive = side === 'sell';

    const classname = classNames({
      'td-recent-trades__yours__positive': isPositive,
      'td-recent-trades__yours__negative': !isPositive,
    });

    return [
      <span className={classname} key={id}>
        <Decimal key={id} fixed={priceFixed} prevValue={[...list][i - 1] ? [...list][i - 1].price : 0}>
          {price}
        </Decimal>
      </span>,
      <span key={id}>
        <Decimal key={id} fixed={amountFixed}>
          {amount}
        </Decimal>
      </span>,
      <span key={id}>{higlightedDate}</span>,
    ];
  };

  const handleOnSelect = (index: string) => {
    const priceToSet = list[Number(index)] ? Number(list[Number(index)].price) : 0;

    if (currentPrice !== priceToSet) {
      dispatch(setCurrentPrice(priceToSet));
    }
  };

  const renderContent = () => {
    return (
      <div className="td-recent-trades__yours">
        <Table header={getHeaders()} data={retrieveData()} onSelect={handleOnSelect} />
      </div>
    );
  };

  const className = classNames({
    'td-tab-content__noData': retrieveData()[0][1] === intl.formatMessage({ id: 'page.noDataToShow' }),
  });

  return (
    <div className={className}>
      {fetching ? (
        <div className="td-tab-content-loading">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
};

export const RecentTradesYours = RecentTradesYoursContainer;
